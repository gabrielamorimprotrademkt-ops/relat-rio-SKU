const { google } = require('googleapis');
const fs = require('fs');

const SPREADSHEET_ID = '11FtS39zfBRvGz89Ld3JRVDUrvzK7xKJSNQuZBSbKF_0';
const KEY_FILE = './public/mcp-conect-8d70569bfae4.json';

async function main() {
  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  // Ler todas as colunas A até K da aba BASE DE LOJAS
  const full = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `BASE DE LOJAS!A1:K200`,
  });

  const rows = full.data.values || [];
  const header = rows[0];
  console.log('COLUNAS:', JSON.stringify(header));

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

  // Gravar JSON para usar no dashboard
  fs.writeFileSync('./public/data.json', JSON.stringify(data, null, 2));
  console.log(`Gerado public/data.json com ${data.length} registros`);

  // Mostrar amostra dos status únicos
  const statusUnicos = [...new Set(data.map(d => d.situacao))];
  const bandeirasUnicas = [...new Set(data.map(d => d.bandeira))];
  console.log('STATUS ÚNICOS:', statusUnicos);
  console.log('BANDEIRAS:', bandeirasUnicas);
}

main().catch(console.error);
