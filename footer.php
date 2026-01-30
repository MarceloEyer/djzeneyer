<?php
/**
 * Footer Template - Zen Eyer Theme
 * Encerra a estrutura HTML e gerencia a transição visual para o React.
 */
?>

    </div> <script>
        // 🕵️‍♂️ DETECTOR DE REACT (Transição Suave)
        // Monitora o container #root. Assim que o React injeta conteúdo novo,
        // adicionamos a classe .react-loaded ao body.
        (function() {
            let attempts = 0;
            
            const checkReact = setInterval(function() {
                attempts++;
                
                // Procura por qualquer div dentro do root que NÃO seja o nosso conteúdo estático
                const rootContent = document.querySelector('#root > div:not(.ssr-content)');
                
                if (rootContent) {
                    // React montou! Ativa o CSS que esconde o fallback
                    document.body.classList.add('react-loaded');
                    clearInterval(checkReact);
                } 
                // Desiste após ~10 segundos (evita loop infinito em caso de erro fatal no JS)
                else if (attempts >= 200) {
                    clearInterval(checkReact);
                    console.warn('[Theme] ⚠️ React load timeout - mantendo fallback visível.');
                }
            }, 50); // Checa a cada 50ms (muito rápido para evitar piscadas)
        })();
    </script>

    <?php 
    // O WordPress injeta os scripts do Vite/React e outros plugins aqui
    wp_footer(); 
    ?>
</body>
</html> 