with open("src/pages/PrivacyPolicyPage.tsx", "r") as f:
    content = f.read()

# For {t('privacy_page.title').split(' ')[0]}
content = content.replace(
    "{t('privacy_page.title').split(' ')[0]}",
    "{t('privacy_page.title').substring(0, t('privacy_page.title').indexOf(' '))}"
)
content = content.replace(
    "{t('privacy_page.title').split(' ').slice(1).join(' ')}",
    "{t('privacy_page.title').substring(t('privacy_page.title').indexOf(' ') + 1)}"
)

# For third party analytics etc.
keys = ["third_party_analytics", "third_party_payments", "third_party_email"]
for key in keys:
    content = content.replace(
        f"{{t('privacy_page.{key}').split(':')[0]}}",
        f"{{t('privacy_page.{key}').substring(0, t('privacy_page.{key}').indexOf(':'))}}"
    )
    content = content.replace(
        f"{{t('privacy_page.{key}').split(':')[1]}}",
        f"{{t('privacy_page.{key}').substring(t('privacy_page.{key}').indexOf(':') + 1)}}"
    )

with open("src/pages/PrivacyPolicyPage.tsx", "w") as f:
    f.write(content)

print("Patched PrivacyPolicy")
