with open("src/components/common/UserMenu.tsx", "r") as f:
    content = f.read()

content = content.replace(
    "{user.name || user.email.split('@')[0]}",
    "{user.name || (user.email.indexOf('@') !== -1 ? user.email.substring(0, user.email.indexOf('@')) : user.email)}"
)

with open("src/components/common/UserMenu.tsx", "w") as f:
    f.write(content)

print("Patched UserMenu")
