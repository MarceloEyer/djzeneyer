with open("src/components/HeadlessSEO.tsx", "r") as f:
    content = f.read()

import re
old_block = """    const nameParts = fullName.split(' ').filter(Boolean);
    cached = {
      authorFirstName: nameParts[0] || stageName,
      authorLastName: nameParts.slice(1).join(' ') || stageName
    };"""

new_block = """    // ⚡ Bolt: Replaced allocating string split with zero-allocation index search for first name boundary
    const spaceIdx = fullName.indexOf(' ');
    if (spaceIdx !== -1) {
      cached = {
        authorFirstName: fullName.substring(0, spaceIdx) || stageName,
        authorLastName: fullName.substring(spaceIdx + 1).trim() || stageName
      };
    } else {
      cached = {
        authorFirstName: fullName || stageName,
        authorLastName: stageName
      };
    }"""

content = content.replace(old_block, new_block)

with open("src/components/HeadlessSEO.tsx", "w") as f:
    f.write(content)

print("Patched HeadlessSEO")
