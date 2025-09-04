#!/bin/bash

# Script to optimize apartment images for web using ffmpeg
# Creates three sizes: full (1920px), medium (1200px), small (800px)

SOURCE_DIR="./assets/img/source"
OUTPUT_DIR="./assets/img/optimized"

# Counter for naming
counter=1

# Function to optimize image
optimize_image() {
    local input_file="$1"
    local filename=$(basename "$input_file")
    local dir_name=$(basename $(dirname "$input_file"))

    # Create output filename with directory prefix
    local output_name="${counter}_${dir_name}_${filename%.*}.jpg"

    echo "Processing: $input_file -> $output_name"

    # Full size (1920px max width, high quality for lightbox)
    ffmpeg -i "$input_file" -vf "scale='min(1920,iw)':-1" -q:v 2 -y "$OUTPUT_DIR/full/$output_name" 2>/dev/null

    # Medium size (1200px max width for desktop gallery)
    ffmpeg -i "$input_file" -vf "scale='min(1200,iw)':-1" -q:v 3 -y "$OUTPUT_DIR/medium/$output_name" 2>/dev/null

    # Small size (800px max width for mobile)
    ffmpeg -i "$input_file" -vf "scale='min(800,iw)':-1" -q:v 4 -y "$OUTPUT_DIR/small/$output_name" 2>/dev/null

    # Get file sizes for comparison
    original_size=$(ls -lh "$input_file" | awk '{print $5}')
    full_size=$(ls -lh "$OUTPUT_DIR/full/$output_name" 2>/dev/null | awk '{print $5}')
    medium_size=$(ls -lh "$OUTPUT_DIR/medium/$output_name" 2>/dev/null | awk '{print $5}')
    small_size=$(ls -lh "$OUTPUT_DIR/small/$output_name" 2>/dev/null | awk '{print $5}')

    echo "  Original: $original_size | Full: $full_size | Medium: $medium_size | Small: $small_size"

    counter=$((counter + 1))
}

# Process living room images first (for main gallery)
echo "=== Processing Living Room Images ==="
for img in "$SOURCE_DIR"/living_room/*.jpeg; do
    [ -f "$img" ] && optimize_image "$img"
done

for img in "$SOURCE_DIR"/living_room_floor/*.jpeg; do
    [ -f "$img" ] && optimize_image "$img"
done

# Process kitchen images
echo -e "\n=== Processing Kitchen Images ==="
for img in "$SOURCE_DIR"/kitchen/*.jpeg; do
    [ -f "$img" ] && optimize_image "$img"
done

# Process bedroom images
echo -e "\n=== Processing Bedroom Images ==="
for img in "$SOURCE_DIR"/bedroom_base/*.jpeg; do
    [ -f "$img" ] && optimize_image "$img"
done

for img in "$SOURCE_DIR"/bedroom_floor/*.jpeg; do
    [ -f "$img" ] && optimize_image "$img"
done

# Process bathroom images
echo -e "\n=== Processing Bathroom Images ==="
for img in "$SOURCE_DIR"/bathroom_base/*.jpeg; do
    [ -f "$img" ] && optimize_image "$img"
done

for img in "$SOURCE_DIR"/bathroom_floor/*.jpeg; do
    [ -f "$img" ] && optimize_image "$img"
done

# Process other images
echo -e "\n=== Processing Other Images ==="
for img in "$SOURCE_DIR"/entrance/*.jpeg; do
    [ -f "$img" ] && optimize_image "$img"
done

for img in "$SOURCE_DIR"/wardrobe/*.jpeg; do
    [ -f "$img" ] && optimize_image "$img"
done

for img in "$SOURCE_DIR"/drone/*.jpeg; do
    [ -f "$img" ] && optimize_image "$img"
done

# Process parking images (keep original names for clarity)
echo -e "\n=== Processing Parking Images ==="
if [ -d "$SOURCE_DIR/parking" ]; then
    for img in "$SOURCE_DIR"/parking/*.{jpg,jpeg,png}; do
        if [ -f "$img" ]; then
            filename=$(basename "$img")
            base_name="${filename%.*}"
            
            echo "Processing parking image: $filename"
            
            # Full size (1920px max width, high quality for lightbox)
            ffmpeg -i "$img" -vf "scale='min(1920,iw)':-1" -q:v 2 -y "$OUTPUT_DIR/full/${base_name}.jpg" 2>/dev/null
            
            # Medium size (1200px max width for desktop gallery)
            ffmpeg -i "$img" -vf "scale='min(1200,iw)':-1" -q:v 3 -y "$OUTPUT_DIR/medium/${base_name}.jpg" 2>/dev/null
            
            # Small size (800px max width for mobile)
            ffmpeg -i "$img" -vf "scale='min(800,iw)':-1" -q:v 4 -y "$OUTPUT_DIR/small/${base_name}.jpg" 2>/dev/null
            
            echo "  Saved as: ${base_name}.jpg in all sizes"
        fi
    done
fi

# Process header images for okolica section
echo -e "\n=== Processing Okolica Header Images ==="
if [ -d "$SOURCE_DIR/okolica_headers" ]; then
    for img in "$SOURCE_DIR"/okolica_headers/*.{jpg,jpeg,png}; do
        if [ -f "$img" ]; then
            filename=$(basename "$img")
            base_name="${filename%.*}"
            
            echo "Processing header image: $filename"
            
            # Full size (1920px max width, high quality for lightbox)
            ffmpeg -i "$img" -vf "scale='min(1920,iw)':-1" -q:v 2 -y "$OUTPUT_DIR/full/header_${base_name}.jpg" 2>/dev/null
            
            # Medium size (1200px max width for desktop headers)
            ffmpeg -i "$img" -vf "scale='min(1200,iw)':-1" -q:v 3 -y "$OUTPUT_DIR/medium/header_${base_name}.jpg" 2>/dev/null
            
            # Small size (800px max width for mobile headers)  
            ffmpeg -i "$img" -vf "scale='min(800,iw)':-1" -q:v 4 -y "$OUTPUT_DIR/small/header_${base_name}.jpg" 2>/dev/null
            
            echo "  Saved as: header_${base_name}.jpg in all sizes"
        fi
    done
fi

echo -e "\n=== Optimization Complete ==="
echo "Images saved to: $OUTPUT_DIR"

# Show total sizes
echo -e "\nDirectory sizes:"
du -sh "$OUTPUT_DIR"/*