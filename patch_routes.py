with open("src/config/routes.ts", "r") as f:
    content = f.read()

content = content.replace(
    "const enSlug = rawEnSlug.split('/:')[0];",
    "const enSlugIdx = rawEnSlug.indexOf('/:');\n  const enSlug = enSlugIdx !== -1 ? rawEnSlug.substring(0, enSlugIdx) : rawEnSlug;"
)
content = content.replace(
    "const ptSlug = rawPtSlug.split('/:')[0];",
    "const ptSlugIdx = rawPtSlug.indexOf('/:');\n  const ptSlug = ptSlugIdx !== -1 ? rawPtSlug.substring(0, ptSlugIdx) : rawPtSlug;"
)

with open("src/config/routes.ts", "w") as f:
    f.write(content)

print("Patched Routes")
