export function BotaoVoltar({ onClick }) {
    return (
        <button
            onClick={onClick}
            style={{
                padding: '8px 16px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
            }}
        >
            Voltar
        </button>
    );
}