import os
import math
import random
from PIL import Image, ImageDraw, ImageFilter

os.makedirs('assets/images', exist_ok=True)

def create_base_canvas(w, h, bg_color):
    return Image.new('RGB', (w, h), bg_color)

def generate_tech_image(filename, w, h, bg_color, primary_color, secondary_color, title_text, subtitle_text):
    im = Image.new('RGB', (w, h), bg_color)
    draw = ImageDraw.Draw(im)

    # Subtle tech grid
    grid_spacing = 32
    for x in range(0, w, grid_spacing):
        draw.line([(x, 0), (x, h)], fill=(bg_color[0]+12, bg_color[1]+14, bg_color[2]+18), width=1)
    for y in range(0, h, grid_spacing):
        draw.line([(0, y), (w, y)], fill=(bg_color[0]+12, bg_color[1]+14, bg_color[2]+18), width=1)

    # Ambient glow
    glow = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    gdraw.ellipse([w - 350, -50, w + 150, 400], fill=(*primary_color, 45))
    gdraw.ellipse([50, h - 250, 450, h + 150], fill=(*secondary_color, 35))
    glow = glow.filter(ImageFilter.GaussianBlur(60))
    im.paste(glow, (0, 0), glow)
    draw = ImageDraw.Draw(im)

    # Outer decorative frame
    pad = 28
    draw.rounded_rectangle([pad, pad, w - pad, h - pad], radius=18, fill=(bg_color[0]+6, bg_color[1]+8, bg_color[2]+12), outline=(bg_color[0]+30, bg_color[1]+35, bg_color[2]+45), width=2)

    # Top header bar
    draw.rounded_rectangle([pad, pad, w - pad, pad + 48], radius=18, fill=(bg_color[0]+14, bg_color[1]+18, bg_color[2]+24))
    draw.rectangle([pad, pad + 24, w - pad, pad + 48], fill=(bg_color[0]+14, bg_color[1]+18, bg_color[2]+24))
    # Window dots
    draw.ellipse([pad + 18, pad + 18, pad + 28, pad + 28], fill=(239, 68, 68))
    draw.ellipse([pad + 34, pad + 18, pad + 44, pad + 28], fill=(245, 158, 11))
    draw.ellipse([pad + 50, pad + 18, pad + 60, pad + 28], fill=(16, 185, 129))
    
    # Title pill
    draw.rounded_rectangle([pad + 80, pad + 12, pad + 320, pad + 36], radius=12, fill=(bg_color[0]+25, bg_color[1]+30, bg_color[2]+40))
    draw.text((pad + 95, pad + 16), title_text, fill=primary_color)

    # Visual content area
    content_y = pad + 65
    cw = w - pad * 2 - 40
    ch = h - content_y - pad - 20

    # 3 Stat Cards on top
    stat_w = (cw - 30) // 3
    for i in range(3):
        sx = pad + 20 + i * (stat_w + 15)
        sy = content_y
        draw.rounded_rectangle([sx, sy, sx + stat_w, sy + 75], radius=12, fill=(bg_color[0]+16, bg_color[1]+22, bg_color[2]+32), outline=primary_color if i==0 else (71, 85, 105), width=1)
        draw.rounded_rectangle([sx + 14, sy + 14, sx + 90, sy + 24], radius=4, fill=(148, 163, 184))
        draw.rounded_rectangle([sx + 14, sy + 38, sx + 140, sy + 58], radius=6, fill=primary_color if i==0 else secondary_color)

    # Main Chart / Visual block below stats
    chart_y = content_y + 95
    chart_h = ch - 95
    draw.rounded_rectangle([pad + 20, chart_y, pad + 20 + cw, chart_y + chart_h], radius=14, fill=(bg_color[0]+12, bg_color[1]+16, bg_color[2]+25), outline=(51, 65, 85), width=1)

    # Grid lines
    for gy in range(chart_y + 35, chart_y + chart_h - 20, 40):
        draw.line([(pad + 35, gy), (pad + 5 + cw, gy)], fill=(bg_color[0]+24, bg_color[1]+30, bg_color[2]+42), width=1)

    # Wave/Polyline
    pts = []
    num_pts = 9
    step = (cw - 40) / (num_pts - 1)
    for i in range(num_pts):
        px = pad + 40 + i * step
        py = chart_y + chart_h - 40 - (math.sin(i * 0.8) * 35 + i * 8 + random.randint(5, 25))
        pts.append((px, py))

    for i in range(len(pts) - 1):
        draw.line([pts[i], pts[i+1]], fill=primary_color, width=4)
        draw.ellipse([pts[i][0]-5, pts[i][1]-5, pts[i][0]+5, pts[i][1]+5], fill=primary_color, outline=(255, 255, 255), width=2)
    draw.ellipse([pts[-1][0]-6, pts[-1][1]-6, pts[-1][0]+6, pts[-1][1]+6], fill=primary_color, outline=(255, 255, 255), width=2)

    # Sub-curve
    pts2 = [(p[0], p[1] + 25) for p in pts]
    for i in range(len(pts2) - 1):
        draw.line([pts2[i], pts2[i+1]], fill=secondary_color, width=2)

    target_path = f'assets/images/{filename}'
    im.save(target_path, 'WEBP', quality=85)
    print(f"{filename} generated, size: {os.path.getsize(target_path)} bytes")

# Generate new images
generate_tech_image('about-hero-vision.webp', 880, 520, (15, 23, 42), (255, 106, 0), (14, 165, 233), "STACKLY AUTONOMOUS LABS", "Sub-second decision clarity")
generate_tech_image('about-global-datacenters.webp', 850, 480, (15, 23, 42), (16, 185, 129), (255, 106, 0), "18 TIER-4 GLOBAL REGIONS", "99.999% SLA Uptime")
generate_tech_image('services-hero-overview.webp', 850, 500, (15, 23, 42), (255, 106, 0), (139, 92, 246), "SOLUTIONS BLUEPRINT", "Real-time BI & Analytics")
generate_tech_image('services-security-shield.webp', 800, 480, (15, 23, 42), (14, 165, 233), (255, 106, 0), "ZERO-STORAGE GOVERNANCE", "SOC2 Type II & HIPAA")
generate_tech_image('contact-global-support.webp', 800, 480, (15, 23, 42), (255, 106, 0), (16, 185, 129), "24/7 MISSION CONTROL", "Follow-The-Sun Ops")
generate_tech_image('blog-whitepaper-cover.webp', 750, 460, (15, 23, 42), (245, 158, 11), (255, 106, 0), "EXECUTIVE BI BENCHMARK", "10B Rows Audited")
generate_tech_image('home-connectors-ecosystem.webp', 820, 460, (15, 23, 42), (56, 189, 248), (255, 106, 0), "500+ NATIVE CLOUD CONNECTORS", "Continuous CDC Stream")
generate_tech_image('home-pricing-roi.webp', 820, 460, (15, 23, 42), (16, 185, 129), (255, 106, 0), "ENTERPRISE ROI CALCULATOR", "42% Average Cloud Savings")
