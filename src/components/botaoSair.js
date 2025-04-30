export function BotaoSair({onClick}) {
    return (
        <button onClick={onClick} style={{
            padding: '8px 16px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
        }}>
            Sair
        </button>
    );
}