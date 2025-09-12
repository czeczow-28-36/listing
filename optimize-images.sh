#!/bin/bash

# Optimize images script using ffmpeg
# Converts images from assets/img/source to optimized versions in assets/img/output

SOURCE_DIR="assets/img/source"
OUTPUT_DIR="assets/img/output"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Function to optimize a single image
optimize_image() {
    local input_file="$1"
    local relative_path="${input_file#$SOURCE_DIR/}"
    local output_file="$OUTPUT_DIR/$relative_path"
    local output_dir=$(dirname "$output_file")
    
    # Create subdirectory in output if needed
    mkdir -p "$output_dir"
    
    # Get file extension
    local extension="${input_file##*.}"
    local extension_lower=$(echo "$extension" | tr '[:upper:]' '[:lower:]')
    
    echo "Processing: $relative_path"
    
    # Optimize based on file type
    case "$extension_lower" in
        jpg|jpeg)
            # JPEG optimization: quality 85, progressive encoding, strip metadata
            ffmpeg -i "$input_file" -q:v 2 -vf "scale='min(2048,iw)':'-1'" -y "$output_file" 2>/dev/null
            ;;
        png)
            # PNG optimization: compression level 9, strip metadata
            ffmpeg -i "$input_file" -compression_level 9 -vf "scale='min(2048,iw)':'-1'" -y "$output_file" 2>/dev/null
            ;;
        webp)
            # WebP optimization: quality 85
            ffmpeg -i "$input_file" -quality 85 -vf "scale='min(2048,iw)':'-1'" -y "$output_file" 2>/dev/null
            ;;
        gif)
            # GIF optimization: keep as is but limit size
            ffmpeg -i "$input_file" -vf "scale='min(1024,iw)':'-1':flags=lanczos" -y "$output_file" 2>/dev/null
            ;;
        *)
            # For other formats, just copy
            cp "$input_file" "$output_file"
            ;;
    esac
    
    # Check if optimization was successful
    if [ -f "$output_file" ]; then
        local input_size=$(stat -f%z "$input_file" 2>/dev/null || stat -c%s "$input_file" 2>/dev/null)
        local output_size=$(stat -f%z "$output_file" 2>/dev/null || stat -c%s "$output_file" 2>/dev/null)
        local reduction=$((100 - (output_size * 100 / input_size)))
        echo "  ✓ Reduced by ${reduction}% ($(numfmt --to=iec $input_size) → $(numfmt --to=iec $output_size))"
    else
        echo "  ✗ Failed to optimize"
    fi
}

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "Error: ffmpeg is not installed. Please install it first."
    echo "On macOS: brew install ffmpeg"
    echo "On Ubuntu/Debian: sudo apt-get install ffmpeg"
    exit 1
fi

# Check if source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo "Error: Source directory $SOURCE_DIR does not exist"
    exit 1
fi

echo "Starting image optimization..."
echo "Source: $SOURCE_DIR"
echo "Output: $OUTPUT_DIR"
echo "---"

# Find and process all image files
total_files=0
processed_files=0

while IFS= read -r -d '' file; do
    ((total_files++))
    optimize_image "$file"
    ((processed_files++))
done < <(find "$SOURCE_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" -o -iname "*.webp" \) -print0)

echo "---"
echo "Optimization complete!"
echo "Processed $processed_files out of $total_files images"