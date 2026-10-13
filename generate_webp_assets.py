import os
import math
import random
from PIL import Image, ImageDraw, ImageFont, ImageFilter

os.makedirs('assets/images', exist_ok=True)

def create_gradient(width, height, color1, color2, vertical=True):
    base = Image.new('RGB', (width, height), color1)
    top = Image.new('RGB', (width, height), color2)
    mask = Image.new('L', (width, height))
    mask_data = []
    for y in range(height):
        for x in range(width):
            if vertical:
                val = int(255 * (y / height))
            else:
                val = int(255 * (x / width))
            mask_data.append(val)
    mask.putdata(mask_data)
    base.paste(top, (0, 0), mask)
    return base

def draw_rounded_rect(draw, bbox, radius, fill=None, outline=None, width=1):
    draw.rounded_rectangle(bbox, radius=radius, fill=fill, outline=outline, width=width)

# 1. hero-bi-dashboard.webp: 1200x800
def generate_hero():
    w, h = 1000, 680
    im = Image.new('RGB', (w, h), (15, 23, 42)) # Deep navy/slate dark tech canvas
    draw = ImageDraw.Draw(im)
    
    # Background subtle grid
    for x in range(0, w, 40):
        draw.line([(x, 0), (x, h)], fill=(28, 41, 66), width=1)
    for y in range(0, h, 40):
        draw.line([(0, y), (w, y)], fill=(28, 41, 66), width=1)

    # Glow orb in top right (Orange Stackly theme)
    glow = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    gdraw.ellipse([w-450, -100, w+200, 500], fill=(255, 106, 0, 45))
    gdraw.ellipse([100, 200, 600, 700], fill=(14, 165, 233, 30)) # Cyan accent
    glow = glow.filter(ImageFilter.GaussianBlur(80))
    im.paste(glow, (0, 0), glow)
    draw = ImageDraw.Draw(im)

    # Main BI Dashboard Window
    pad_x, pad_y = 60, 50
    dw, dh = w - pad_x*2, h - pad_y*2
    draw.rounded_rectangle([pad_x, pad_y, pad_x + dw, pad_y + dh], radius=24, fill=(18, 24, 38), outline=(51, 65, 85), width=2)

    # Window Header bar
    draw.rounded_rectangle([pad_x, pad_y, pad_x + dw, pad_y + 54], radius=24, fill=(24, 32, 50))
    draw.rectangle([pad_x, pad_y + 30, pad_x + dw, pad_y + 54], fill=(24, 32, 50))
    # Window dots
    draw.ellipse([pad_x + 22, pad_y + 22, pad_x + 34, pad_y + 34], fill=(239, 68, 68))
    draw.ellipse([pad_x + 42, pad_y + 22, pad_x + 54, pad_y + 34], fill=(245, 158, 11))
    draw.ellipse([pad_x + 62, pad_y + 22, pad_x + 74, pad_y + 34], fill=(16, 185, 129))
    
    # Window title pill
    draw.rounded_rectangle([pad_x + 100, pad_y + 14, pad_x + 360, pad_y + 42], radius=14, fill=(30, 41, 59), outline=(71, 85, 105), width=1)
    
    # Left sidebar of dashboard
    draw.rectangle([pad_x, pad_y + 54, pad_x + 180, pad_y + dh], fill=(15, 21, 35))
    draw.line([(pad_x + 180, pad_y + 54), (pad_x + 180, pad_y + dh)], fill=(40, 53, 72), width=1)
    for i in range(5):
        sy = pad_y + 80 + i * 44
        is_active = (i == 0)
        bg = (255, 106, 0, 30) if is_active else None
        if is_active:
            draw.rounded_rectangle([pad_x + 16, sy, pad_x + 164, sy + 32], radius=8, fill=(255, 106, 0, 60))
        draw.rounded_rectangle([pad_x + 24, sy + 8, pad_x + 40, sy + 24], radius=4, fill=(255, 122, 0) if is_active else (100, 116, 139))
        draw.rounded_rectangle([pad_x + 50, sy + 10, pad_x + 140, sy + 22], radius=4, fill=(241, 245, 249) if is_active else (148, 163, 184))

    # Main dashboard content area
    cx = pad_x + 200
    cy = pad_y + 70

    # 3 Metric Cards
    card_w = (dw - 240) // 3
    metrics = [("ARR Growth", "+38.4%", (255, 106, 0)), ("Data Stream", "4.2M/sec", (16, 185, 129)), ("Query Latency", "12.4ms", (56, 189, 248))]
    for idx, (title, val, col) in enumerate(metrics):
        bx = cx + idx * (card_w + 14)
        draw.rounded_rectangle([bx, cy, bx + card_w, cy + 86], radius=14, fill=(26, 35, 54), outline=(51, 65, 85), width=1)
        draw.rectangle([bx + 16, cy + 18, bx + 70, cy + 28], fill=(148, 163, 184))
        draw.rectangle([bx + 16, cy + 40, bx + 120, cy + 62], fill=col)

    # Big Line Chart Area
    chart_y = cy + 104
    chart_w = dw - 230
    chart_h = 240
    draw.rounded_rectangle([cx, chart_y, cx + chart_w, chart_y + chart_h], radius=16, fill=(22, 30, 48), outline=(51, 65, 85), width=1)
    
    # Horizontal grid lines in chart
    for gy in range(chart_y + 35, chart_y + chart_h - 20, 45):
        draw.line([(cx + 20, gy), (cx + chart_w - 20, gy)], fill=(34, 46, 68), width=1)

    # Glowing Polyline for BI Trend
    pts = [
        (cx + 40, chart_y + 180),
        (cx + 120, chart_y + 150),
        (cx + 200, chart_y + 165),
        (cx + 280, chart_y + 110),
        (cx + 360, chart_y + 130),
        (cx + 440, chart_y + 80),
        (cx + 520, chart_y + 95),
        (cx + 600, chart_y + 45)
    ]
    for i in range(len(pts) - 1):
        draw.line([pts[i], pts[i+1]], fill=(255, 106, 0), width=4)
        draw.ellipse([pts[i][0]-5, pts[i][1]-5, pts[i][0]+5, pts[i][1]+5], fill=(255, 140, 0), outline=(255, 255, 255), width=2)
    draw.ellipse([pts[-1][0]-6, pts[-1][1]-6, pts[-1][0]+6, pts[-1][1]+6], fill=(255, 106, 0), outline=(255, 255, 255), width=2)

    # Secondary comparison curve (Cyan)
    pts2 = [
        (cx + 40, chart_y + 200),
        (cx + 120, chart_y + 190),
        (cx + 200, chart_y + 175),
        (cx + 280, chart_y + 160),
        (cx + 360, chart_y + 145),
        (cx + 440, chart_y + 125),
        (cx + 520, chart_y + 115),
        (cx + 600, chart_y + 90)
    ]
    for i in range(len(pts2) - 1):
        draw.line([pts2[i], pts2[i+1]], fill=(56, 189, 248), width=2)

    # Two bottom preview widgets (Bar chart & Donut)
    by = chart_y + chart_h + 16
    bh = dh - (by - pad_y) - 20
    # Left widget: Bar distribution
    w1 = (chart_w - 20) * 0.6
    draw.rounded_rectangle([cx, by, cx + w1, by + bh], radius=14, fill=(26, 35, 54), outline=(51, 65, 85), width=1)
    bar_x = cx + 24
    for b_idx in range(7):
        bw = 28
        bh_val = 30 + (b_idx % 4) * 20 + b_idx * 6
        draw.rounded_rectangle([bar_x, by + bh - 18 - bh_val, bar_x + bw, by + bh - 18], radius=6, fill=(255, 106, 0) if b_idx == 5 else (71, 85, 105))
        bar_x += bw + 14

    # Right widget: Status / Donut preview
    w2 = chart_w - w1 - 20
    draw.rounded_rectangle([cx + w1 + 20, by, cx + chart_w, by + bh], radius=14, fill=(26, 35, 54), outline=(51, 65, 85), width=1)
    dcx = cx + w1 + 20 + w2 // 2
    dcy = by + bh // 2
    draw.ellipse([dcx - 38, dcy - 38, dcx + 38, dcy + 38], outline=(255, 106, 0), width=10)
    draw.arc([dcx - 38, dcy - 38, dcx + 38, dcy + 38], start=45, end=180, fill=(56, 189, 248), width=10)
    draw.arc([dcx - 38, dcy - 38, dcx + 38, dcy + 38], start=180, end=270, fill=(16, 185, 129), width=10)

    im.save('assets/images/hero-bi-dashboard.webp', 'WEBP', quality=85)
    print("hero-bi-dashboard.webp generated, size:", os.path.getsize('assets/images/hero-bi-dashboard.webp'))

# 2. bi-architecture.webp: Modern Cloud Data Warehouse Pipeline
def generate_architecture():
    w, h = 900, 600
    im = Image.new('RGB', (w, h), (15, 23, 42))
    draw = ImageDraw.Draw(im)
    
    # Subtle gradient background
    for y in range(h):
        r = int(15 + (y/h) * 10)
        g = int(23 + (y/h) * 12)
        b = int(42 + (y/h) * 18)
        draw.line([(0, y), (w, y)], fill=(r, g, b))

    # Grid lines
    for x in range(0, w, 50):
        draw.line([(x, 0), (x, h)], fill=(30, 41, 59, 100), width=1)

    # 3 Pipeline stages (Ingest -> Stackly Transform & AI Engine -> Realtime BI Visuals)
    stages = [
        ("Data Ingestion", ["PostgreSQL", "Snowflake", "Salesforce", "Kafka Stream"], 120, (56, 189, 248)),
        ("Stackly Semantic Engine", ["Auto ETL", "AI NLQ Model", "Cache Matrix", "Metric Store"], 450, (255, 106, 0)),
        ("Intelligence Delivery", ["Executive Deck", "Embedded SDK", "Slack Alerts", "Auto Predictive"], 780, (16, 185, 129))
    ]

    # Draw connectors between stages
    for y_offset in [180, 260, 340, 420]:
        draw.line([(190, y_offset), (380, y_offset)], fill=(71, 85, 105), width=2)
        draw.line([(520, y_offset), (710, y_offset)], fill=(71, 85, 105), width=2)
        # Pulse dots
        draw.ellipse([270-4, y_offset-4, 270+4, y_offset+4], fill=(255, 106, 0))
        draw.ellipse([600-4, y_offset-4, 600+4, y_offset+4], fill=(16, 185, 129))

    for title, items, center_x, theme_color in stages:
        box_w = 170
        box_h = 360
        bx = center_x - box_w // 2
        by = 130
        draw.rounded_rectangle([bx, by, bx + box_w, by + box_h], radius=18, fill=(24, 33, 52), outline=theme_color, width=2)
        draw.rounded_rectangle([bx + 14, by + 16, bx + box_w - 14, by + 46], radius=8, fill=theme_color)
        
        # Sub-blocks
        for idx, item in enumerate(items):
            iy = by + 65 + idx * 68
            draw.rounded_rectangle([bx + 12, iy, bx + box_w - 12, iy + 52], radius=10, fill=(33, 44, 68), outline=(51, 65, 85), width=1)
            draw.ellipse([bx + 24, iy + 20, bx + 36, iy + 32], fill=theme_color)
            draw.rounded_rectangle([bx + 46, iy + 22, bx + box_w - 24, iy + 30], radius=4, fill=(226, 232, 240))

    im.save('assets/images/bi-architecture.webp', 'WEBP', quality=85)
    print("bi-architecture.webp generated, size:", os.path.getsize('assets/images/bi-architecture.webp'))

# 3. about-team-collab.webp: Collaborative Analytics
def generate_about():
    w, h = 850, 560
    im = Image.new('RGB', (w, h), (248, 250, 252)) # Crisp modern light mode backing
    draw = ImageDraw.Draw(im)

    # Decorative tech blocks
    draw.rounded_rectangle([40, 40, w - 40, h - 40], radius=24, fill=(255, 255, 255), outline=(226, 232, 240), width=2)
    # Background subtle pattern
    for x in range(60, w - 60, 30):
        for y in range(60, h - 60, 30):
            draw.ellipse([x, y, x+2, y+2], fill=(226, 232, 240))

    # Center showcase card
    draw.rounded_rectangle([120, 80, w - 120, h - 80], radius=20, fill=(15, 23, 42), outline=(255, 106, 0), width=2)
    
    # Graphic elements inside card
    draw.text((160, 110), "STACKLY INTELLIGENCE LABS", fill=(255, 106, 0))
    # KPI Grid
    stats = [("Global Analytics Nodes", "98,000+"), ("Daily Data Queries", "1.4 Billion"), ("Prediction Accuracy", "99.8%")]
    for idx, (label, val) in enumerate(stats):
        cx = 160 + idx * 190
        cy = 160
        draw.rounded_rectangle([cx, cy, cx + 170, cy + 100], radius=12, fill=(26, 35, 54), outline=(51, 65, 85), width=1)
        draw.rounded_rectangle([cx + 16, cy + 20, cx + 110, cy + 30], radius=4, fill=(148, 163, 184))
        draw.rounded_rectangle([cx + 16, cy + 46, cx + 140, cy + 70], radius=6, fill=(255, 106, 0) if idx==1 else (56, 189, 248))

    # Flow graphic at bottom
    draw.rounded_rectangle([160, 290, w - 160, 430], radius=14, fill=(22, 30, 48), outline=(51, 65, 85), width=1)
    for i in range(12):
        bx = 180 + i * 42
        by = 380 - (math.sin(i * 0.6) * 45 + 30)
        draw.rounded_rectangle([bx, by, bx + 28, 410], radius=6, fill=(255, 106, 0) if i in [5, 8, 9] else (56, 189, 248))

    im.save('assets/images/about-team-collab.webp', 'WEBP', quality=85)
    print("about-team-collab.webp generated, size:", os.path.getsize('assets/images/about-team-collab.webp'))

# 4-6. Blog Images
def generate_blog_image(filename, primary_color, secondary_color, title_badge):
    w, h = 750, 460
    im = Image.new('RGB', (w, h), (15, 23, 42))
    draw = ImageDraw.Draw(im)

    # Gradient mesh / abstract waves
    for y in range(0, h, 2):
        ratio = y / h
        r = int(18 + 20 * ratio)
        g = int(24 + 15 * ratio)
        b = int(38 + 25 * ratio)
        draw.line([(0, y), (w, y)], fill=(r, g, b))

    # Glowing rings
    glow = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    gdraw.ellipse([w//2 - 180, h//2 - 180, w//2 + 180, h//2 + 180], fill=(*primary_color, 40))
    glow = glow.filter(ImageFilter.GaussianBlur(60))
    im.paste(glow, (0, 0), glow)
    draw = ImageDraw.Draw(im)

    # Stylized central diagram
    draw.rounded_rectangle([60, 50, w - 60, h - 50], radius=20, fill=(20, 28, 46), outline=(51, 65, 85), width=1)
    
    # Badge
    draw.rounded_rectangle([90, 80, 240, 114], radius=8, fill=(*primary_color, 255))
    
    # Dynamic chart / graph in middle
    pts = [(100 + i * 50, int(h//2 + math.sin(i*0.8) * 60 + random.choice([-10, 10]))) for i in range(11)]
    for i in range(len(pts)-1):
        draw.line([pts[i], pts[i+1]], fill=primary_color, width=4)
        draw.ellipse([pts[i][0]-5, pts[i][1]-5, pts[i][0]+5, pts[i][1]+5], fill=secondary_color)
    
    # Secondary elements
    for j in range(4):
        bx = 100 + j * 140
        draw.rounded_rectangle([bx, h - 130, bx + 120, h - 80], radius=8, fill=(28, 38, 60), outline=primary_color, width=1)

    im.save(f'assets/images/{filename}', 'WEBP', quality=85)
    print(f"{filename} generated, size:", os.path.getsize(f'assets/images/{filename}'))

# 7-8. Customer case studies
def generate_case_study(filename, brand_accent):
    w, h = 800, 500
    im = Image.new('RGB', (w, h), (245, 247, 250))
    draw = ImageDraw.Draw(im)

    draw.rounded_rectangle([30, 30, w - 30, h - 30], radius=20, fill=(255, 255, 255), outline=(226, 232, 240), width=2)
    # Accent bar
    draw.rounded_rectangle([30, 30, w - 30, 44], radius=10, fill=brand_accent)
    # Inner dark preview card
    draw.rounded_rectangle([60, 70, w - 60, h - 60], radius=16, fill=(15, 23, 42))
    
    # Data visualization preview
    draw.rounded_rectangle([90, 100, 250, 130], radius=6, fill=brand_accent)
    # Metric cards
    for idx in range(3):
        cx = 90 + idx * 210
        draw.rounded_rectangle([cx, 160, cx + 190, 250], radius=12, fill=(26, 35, 54), outline=(51, 65, 85), width=1)
        draw.rounded_rectangle([cx + 20, 180, cx + 100, 192], radius=4, fill=(148, 163, 184))
        draw.rounded_rectangle([cx + 20, 206, cx + 150, 232], radius=6, fill=brand_accent if idx==0 else (56, 189, 248))

    # Smooth curve
    curve_pts = [(90 + i*48, int(370 - math.cos(i*0.7)*50)) for i in range(13)]
    for i in range(len(curve_pts)-1):
        draw.line([curve_pts[i], curve_pts[i+1]], fill=brand_accent, width=4)
        draw.ellipse([curve_pts[i][0]-4, curve_pts[i][1]-4, curve_pts[i][0]+4, curve_pts[i][1]+4], fill=(255, 255, 255))

    im.save(f'assets/images/{filename}', 'WEBP', quality=85)
    print(f"{filename} generated, size:", os.path.getsize(f'assets/images/{filename}'))

generate_hero()
generate_architecture()
generate_about()
generate_blog_image('blog-ai-future.webp', (255, 106, 0), (255, 180, 0), 'AI Copilot')
generate_blog_image('blog-data-pipeline.webp', (14, 165, 233), (56, 189, 248), 'ETL Pipeline')
generate_blog_image('blog-executive-kpi.webp', (16, 185, 129), (52, 211, 153), 'Executive BI')
generate_case_study('customer-case-fintech.webp', (255, 106, 0))
generate_case_study('customer-case-saas.webp', (14, 165, 233))
