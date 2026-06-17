with open("src/pages/TermsPage.tsx", "r") as f:
    content = f.read()

content = content.replace(
    "{t('legal.terms_page.title').split(' ')[0]}",
    "{t('legal.terms_page.title').substring(0, t('legal.terms_page.title').indexOf(' '))}"
)
content = content.replace(
    "{t('legal.terms_page.title').split(' ').slice(1).join(' ')}",
    "{t('legal.terms_page.title').substring(t('legal.terms_page.title').indexOf(' ') + 1)}"
)

with open("src/pages/TermsPage.tsx", "w") as f:
    f.write(content)

print("Patched TermsPage")
