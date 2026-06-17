with open("src/pages/ZoukFestivalsPage.tsx", "r") as f:
    content = f.read()

content = content.replace("}, [ARTIST.festivals]);", "}, []);")

with open("src/pages/ZoukFestivalsPage.tsx", "w") as f:
    f.write(content)

print("Patched Zouk")
