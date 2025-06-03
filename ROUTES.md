```
Home:
/register -> Registar usuário
/login -> Login de usuário

/admin/login -> Login de admin
/admin/book -> Lista com livros (static com revalidate no create)
/admin/book/[id] -> Livro (static sob demanda)

/home -> menu com funcionalidades

/home/my-books -> Livros já enviados

/home/my-illustrations -> visualizar seus livros (static sob demanda com revalidate)
/home/my-comics
/home/my-summaries

/home/illustrate -> ilustrar livro (action com revalidate)
/home/comic -> transformar em gibi (action com revalidate)
/home/summary -> resumir livros (action com revalidate)

/stripe/webhook -> webhook de pagamentos
```