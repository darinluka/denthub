import os
import shutil

src = r"C:\Users\x1car\.gemini\antigravity-ide\brain\dd517115-22aa-48bd-8469-5866dd313d60\login_background_emerald_1782297270946.png"
dst_dir = r"c:\Users\x1car\Desktop\Dentisti\public\images"
dst = os.path.join(dst_dir, "login-bg.png")

os.makedirs(dst_dir, exist_ok=True)
shutil.copy2(src, dst)
print("Copied successfully.")
