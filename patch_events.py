import re

with open("src/pages/EventsPage.tsx", "r") as f:
    content = f.read()

# Instead of splitting we can use slice to get the last path part. Or better string methods:
# canonical_path.slice(canonical_path.lastIndexOf('/') + 1)
new_content = content.replace(
    "e.canonical_path.split('/').pop()",
    "e.canonical_path.slice(e.canonical_path.lastIndexOf('/') + 1)"
)

with open("src/pages/EventsPage.tsx", "w") as f:
    f.write(new_content)

print("Patched EventsPage")
