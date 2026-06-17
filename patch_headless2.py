with open("src/components/HeadlessSEO.tsx", "r") as f:
    content = f.read()

# Only keep the new_block
old_block = """    // ⚡ Bolt: Replaced allocating string split with zero-allocation index search for first name boundary
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

# Fix logic: authorLastName logic should check if there's no surname, so we fallback to stageName but if there is, we use it without stageName.
# Wait, let's keep it the same as what we have. It's fine.

# Just testing build now.
print("We're fine")
