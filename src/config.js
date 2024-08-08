export const config = {
    port: process.env.PORT || 3041,
    tabelaAny: 'anymarket',
    database: {
        host: process.env.DB_HOST || "",
        port: process.env.DB_PORT || "",
        user: process.env.DB_USER || "",
        password: process.env.DB_PASS || "",
        name: process.env.DB_NAME || "sqlmonitoramento",
      }
}

export default config