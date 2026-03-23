const { google } = require('googleapis');

const SPREADSHEET_ID = '11FtS39zfBRvGz89Ld3JRVDUrvzK7xKJSNQuZBSbKF_0';

module.exports = async function handler(req, res) {
  try {
    let authOptions = {
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    };

    // Tenta pegar da Vercel (Seguro na nuvem), se não achar, tenta o arquivo local
    if (process.env.GOOGLE_CREDENTIALS) {
        const creds = JSON.parse(process.env.GOOGLE_CREDENTIALS);
        authOptions.credentials = {
            client_email: creds.client_email,
            private_key: creds.private_key.replace(/\\n/g, '\n'),
        };
    } else {
        authOptions.keyFile = './public/mcp-conect-8d70569bfae4.json';
    }

    const auth = new google.auth.GoogleAuth(authOptions);
    const sheets = google.sheets({ version: 'v4', auth });

    const full = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `BASE DE LOJAS!A1:K200`,
    });

    const rows = full.data.values || [];
    const data = rows.slice(1).map(row => ({
      responsavel: row[0] || '',
      cliente: row[1] || '',
      bandeira: row[2] || '',
      nomePdvNovo: row[3] || '',
      deParaColeta: row[4] || '',
      nomePdvAntigo: row[5] || '',
      cidade: row[6] || '',
      estado: row[7] || '',
      regiao: row[8] || '',
      situacao: row[10] || '',
    }));

    // Retorna os dados ao vivo sem gravar arquivos estáticos no HD!
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar dados do Google Sheets na nuvem' });
  }
};
