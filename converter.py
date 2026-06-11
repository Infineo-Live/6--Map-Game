    import os
import subprocess
from PIL import Image

try:
    from imageio_ffmpeg import get_ffmpeg_exe
except ImportError:
    get_ffmpeg_exe = None

def get_target_max_size(file_path):
    # Normalize path separators
    normalized_path = file_path.replace('\\', '/')
    
    if '/background/' in normalized_path:
        return (1600, 1200)
    elif '/characters/' in normalized_path:
        return (800, 1000)
    elif '/treasures/' in normalized_path:
        return (512, 512)
    elif '/ui/' in normalized_path:
        if normalized_path.endswith('logo.webp') or normalized_path.endswith('logo.png'):
            return None
        elif normalized_path.endswith('start-btn.webp') or normalized_path.endswith('start-btn.png'):
            return (400, 400)
        else:
            return (800, 800)
    return None

def optimize_image_data(img, file_path, max_size):
    # Calculate new size maintaining aspect ratio
    w, h = img.size
    resized = False
    processed_img = img
    
    if max_size:
        max_w, max_h = max_size
        if w > max_w or h > max_h:
            factor = min(max_w / w, max_h / h)
            new_w = int(w * factor)
            new_h = int(h * factor)
            processed_img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
            resized = True
            print(f"Resizing {os.path.basename(file_path)}: {w}x{h} -> {new_w}x{new_h}")
            
    return processed_img, resized

def convert_png_to_webp(root_dir):
    print("\n--- Starting PNG to WebP Conversion & Optimization ---")
    converted_count = 0
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.lower().endswith('.png'):
                png_path = os.path.join(root, file)
                webp_path = os.path.splitext(png_path)[0] + '.webp'
                
                try:
                    with Image.open(png_path) as img:
                        max_size = get_target_max_size(png_path)
                        processed_img, resized = optimize_image_data(img, png_path, max_size)
                        
                        # Save directly as compressed WebP
                        processed_img.save(webp_path, 'WEBP', quality=80, method=4)
                        
                    os.remove(png_path)
                    converted_count += 1
                    print(f"Converted & Optimized: {file} -> {os.path.basename(webp_path)}")
                except Exception as e:
                    print(f"Error converting {png_path}: {e}")
    print(f"Finished. Converted {converted_count} PNG files.")

def optimize_existing_webp(root_dir):
    print("\n--- Starting Existing WebP Optimization ---")
    total_original = 0
    total_new = 0
    total_saved = 0
    optimized_count = 0
    
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.lower().endswith('.webp'):
                file_path = os.path.join(root, file)
                # Skip temp files
                if file_path.endswith('.tmp'):
                    continue
                    
                orig_size = os.path.getsize(file_path)
                total_original += orig_size
                
                try:
                    with Image.open(file_path) as img:
                        max_size = get_target_max_size(file_path)
                        processed_img, resized = optimize_image_data(img, file_path, max_size)
                        
                        temp_path = file_path + '.tmp'
                        processed_img.save(temp_path, 'WEBP', quality=80, method=4)
                        
                        new_size = os.path.getsize(temp_path)
                        if new_size < orig_size:
                            os.replace(temp_path, file_path)
                            saved = orig_size - new_size
                            total_new += new_size
                            total_saved += saved
                            optimized_count += 1
                            action_str = "Resized & Compressed" if resized else "Compressed"
                            print(f"Optimized {file} [{action_str}]: {orig_size/1024:.1f}KB -> {new_size/1024:.1f}KB (Saved {saved/1024:.1f}KB, -{saved/orig_size*100:.1f}%)")
                        else:
                            if os.path.exists(temp_path):
                                os.remove(temp_path)
                            total_new += orig_size
                except Exception as e:
                    print(f"Error processing {file_path}: {e}")
                    total_new += orig_size
                    
    print(f"Finished. Optimized {optimized_count} existing WebP files.")
    if total_original > 0:
        print(f"Original size: {total_original / (1024*1024):.2f} MB")
        print(f"New size: {total_new / (1024*1024):.2f} MB")
        print(f"Total saved: {total_saved / (1024*1024):.2f} MB (-{total_saved/total_original*100:.1f}%)")

def convert_video_to_webm(root_dir):
    print("\n--- Starting Video to WebM Conversion ---")
    if get_ffmpeg_exe is None:
        print("imageio-ffmpeg is not installed. Skipping video conversion.")
        return
        
    ffmpeg_bin = get_ffmpeg_exe()
    converted_count = 0
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.lower().endswith(('.mp4', '.mov')):
                video_path = os.path.join(root, file)
                webm_path = os.path.splitext(video_path)[0] + '.webm'
                
                print(f"Converting: {video_path} -> {webm_path}")
                try:
                    cmd = [
                        ffmpeg_bin, "-y", "-i", video_path,
                        "-c:v", "libvpx-vp9",
                        "-crf", "30",
                        "-b:v", "0",
                        "-pix_fmt", "yuva420p",
                        "-cpu-used", "4",
                        "-row-mt", "1",
                        "-c:a", "libopus",
                        webm_path
                    ]
                    result = subprocess.run(cmd, capture_output=True, text=True)
                    if result.returncode == 0:
                        os.remove(video_path)
                        converted_count += 1
                        print(f"Successfully converted {file}")
                    else:
                        print(f"Error converting {video_path}: {result.stderr}")
                except Exception as e:
                    print(f"Error converting {video_path}: {e}")
    print(f"Finished. Converted {converted_count} video files.")

def update_references(root_dir):
    print("\n--- Updating Project File References ---")
    extensions = ('.html', '.css', '.js', '.md', '.json')
    updated_count = 0
    for root, dirs, files in os.walk(root_dir):
        # Skip hidden directories like .git
        if any(part.startswith('.') for part in root.split(os.sep)):
            continue
            
        for file in files:
            if file.lower().endswith(extensions):
                file_path = os.path.join(root, file)
                # Skip optimizer scripts
                if file in ('converter.py', 'compress.py'):
                    continue
                
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # Replace PNG references
                    new_content = content.replace('.png', '.webp').replace('.PNG', '.webp')
                    # Replace Video references (keep .mp4 format as requested)
                    new_content = new_content.replace('.mov', '.mp4').replace('.MOV', '.mp4')
                    # Fix accidental moveTo corruption from replacing '.mov' inside 'ctx.moveTo'
                    new_content = new_content.replace('.mp4eTo', '.moveTo').replace('.webmeTo', '.moveTo')
                    
                    if content != new_content:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        updated_count += 1
                        print(f"Updated references in: {file}")
                except Exception as e:
                    print(f"Error updating references in {file_path}: {e}")
    print(f"Finished. Updated references in {updated_count} files.")

if __name__ == "__main__":
    current_dir = os.getcwd()
    assets_dir = os.path.join(current_dir, 'assets')
    
    print(f"Starting unified asset optimizer in: {current_dir}")
    
    # 1. Convert PNGs to WebPs and optimize them during save
    convert_png_to_webp(current_dir)
    
    # 2. Optimize any existing WebP files in assets/images/
    images_dir = os.path.join(assets_dir, 'images')
    if os.path.exists(images_dir):
        optimize_existing_webp(images_dir)
        
    # 3. Convert video assets
    convert_video_to_webm(assets_dir)
    
    # 4. Update code references globally
    update_references(current_dir)
    
    print("\nAll tasks completed successfully!")
