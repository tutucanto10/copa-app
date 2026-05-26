const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
 
// ============================================
// 🔵 TIER FRACO (14 seleções - 154 jogadores)
// Preços base: GOL: 6 | DEF: 5 | MEI: 6 | ATA: 7
// ============================================
 
const JOGADORES_FRACO = {
  
  // 🇮🇷 IRÃ
  'Irã': [
    { nome: 'Alireza Beiranvand', posicao: 'GOL', preco: 6, foto_url: null },
    { nome: 'Sadegh Moharrami', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Hossein Kanani', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Shoja Khalilzadeh', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Ehsan Hajsafi', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Saeid Ezatolahi', posicao: 'MEI', preco: 6, foto_url: null },
    { nome: 'Ahmad Nourollahi', posicao: 'MEI', preco: 5, foto_url: null },
    { nome: 'Alireza Jahanbakhsh', posicao: 'MEI', preco: 6, foto_url: null },
    { nome: 'Mehdi Taremi', posicao: 'ATA', preco: 7, foto_url: null },
    { nome: 'Sardar Azmoun', posicao: 'ATA', preco: 7, foto_url: null },
    { nome: 'Karim Ansarifard', posicao: 'ATA', preco: 6, foto_url: null },
  ],
 
  // 🇹🇳 TUNÍSIA
  'Tunísia': [
    { nome: 'Aymen Dahmen', posicao: 'GOL', preco: 6, foto_url: null },
    { nome: 'Ali Maaloul', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Montassar Talbi', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Yassine Meriah', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Wajdi Kechrida', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Ellyes Skhiri', posicao: 'MEI', preco: 6, foto_url: null },
    { nome: 'Aïssa Laïdouni', posicao: 'MEI', preco: 6, foto_url: null },
    { nome: 'Mohamed Ali Ben Romdhane', posicao: 'MEI', preco: 5, foto_url: null },
    { nome: 'Youssef Msakni', posicao: 'ATA', preco: 6, foto_url: null },
    { nome: 'Wahbi Khazri', posicao: 'ATA', preco: 6, foto_url: null },
    { nome: 'Seifeddine Jaziri', posicao: 'ATA', preco: 5, foto_url: null },
  ],
 
  // 🇸🇦 ARÁBIA SAUDITA
  'Arábia Saudita': [
    { nome: 'Mohammed Al-Owais', posicao: 'GOL', preco: 6, foto_url: null },
    { nome: 'Saud Abdulhamid', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Ali Al-Bulayhi', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Hassan Tambakti', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Yasser Al-Shahrani', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Salem Al-Dawsari', posicao: 'MEI', preco: 6, foto_url: null },
    { nome: 'Sami Al-Najei', posicao: 'MEI', preco: 5, foto_url: null },
    { nome: 'Abdullah Otayf', posicao: 'MEI', preco: 5, foto_url: null },
    { nome: 'Firas Al-Buraikan', posicao: 'ATA', preco: 6, foto_url: null },
    { nome: 'Saleh Al-Shehri', posicao: 'ATA', preco: 6, foto_url: null },
    { nome: 'Haitham Asiri', posicao: 'ATA', preco: 5, foto_url: null },
  ],
 
  // 🇶🇦 QATAR
  'Qatar': [
    { nome: 'Meshaal Barsham', posicao: 'GOL', preco: 6, foto_url: null },
    { nome: 'Pedro Miguel', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Tarek Salman', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Boualem Khoukhi', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Homam Ahmed', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Abdulaziz Hatem', posicao: 'MEI', preco: 6, foto_url: null },
    { nome: 'Karim Boudiaf', posicao: 'MEI', preco: 5, foto_url: null },
    { nome: 'Akram Afif', posicao: 'MEI', preco: 6, foto_url: null },
    { nome: 'Almoez Ali', posicao: 'ATA', preco: 7, foto_url: null },
    { nome: 'Hassan Al-Haydos', posicao: 'ATA', preco: 6, foto_url: null },
    { nome: 'Mohammed Muntari', posicao: 'ATA', preco: 5, foto_url: null },
  ],
 
  // 🇬🇭 GANA
  'Gana': [
    { nome: 'Richard Ofori', posicao: 'GOL', preco: 6, foto_url: null },
    { nome: 'Tariq Lamptey', posicao: 'DEF', preco: 6, foto_url: null },
    { nome: 'Daniel Amartey', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Alexander Djiku', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Gideon Mensah', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Thomas Partey', posicao: 'MEI', preco: 7, foto_url: null },
    { nome: 'Salis Abdul Samed', posicao: 'MEI', preco: 6, foto_url: null },
    { nome: 'Mohammed Kudus', posicao: 'MEI', preco: 7, foto_url: null },
    { nome: 'Jordan Ayew', posicao: 'ATA', preco: 6, foto_url: null },
    { nome: 'Iñaki Williams', posicao: 'ATA', preco: 7, foto_url: null },
    { nome: 'Kamaldeen Sulemana', posicao: 'ATA', preco: 6, foto_url: null },
  ],
 
  // 🇪🇬 EGITO
  'Egito': [
    { nome: 'Mohamed El Shenawy', posicao: 'GOL', preco: 6, foto_url: null },
    { nome: 'Ahmed Hegazi', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Mohamed Abdelmonem', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Mahmoud Hamdi', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Mohamed Hany', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Mohamed Elneny', posicao: 'MEI', preco: 6, foto_url: null },
    { nome: 'Emam Ashour', posicao: 'MEI', preco: 5, foto_url: null },
    { nome: 'Omar Marmoush', posicao: 'MEI', preco: 6, foto_url: null },
    { nome: 'Mohamed Salah', posicao: 'ATA', preco: 8, foto_url: null },
    { nome: 'Mostafa Mohamed', posicao: 'ATA', preco: 6, foto_url: null },
    { nome: 'Trézéguet', posicao: 'ATA', preco: 5, foto_url: null },
  ],
 
  // 🇮🇶 IRAQUE
  'Iraque': [
    { nome: 'Jalal Hassan', posicao: 'GOL', preco: 6, foto_url: null },
    { nome: 'Rebin Sulaka', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Ahmed Ibrahim', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Frans Dhia', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Ali Adnan', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Ibrahim Bayesh', posicao: 'MEI', preco: 5, foto_url: null },
    { nome: 'Amjad Attwan', posicao: 'MEI', preco: 5, foto_url: null },
    { nome: 'Ayman Hussein', posicao: 'MEI', preco: 6, foto_url: null },
    { nome: 'Mohanad Ali', posicao: 'ATA', preco: 6, foto_url: null },
    { nome: 'Aymen Hussein', posicao: 'ATA', preco: 6, foto_url: null },
    { nome: 'Ali Jasim', posicao: 'ATA', preco: 5, foto_url: null },
  ],
 
  // 🇯🇴 JORDÂNIA
  'Jordânia': [
    { nome: 'Yazeed Abulaila', posicao: 'GOL', preco: 6, foto_url: null },
    { nome: 'Salem Al-Ajalin', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Yazan Al-Arab', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Abdallah Nasib', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Ehsan Haddad', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Noor Al-Rawabdeh', posicao: 'MEI', preco: 5, foto_url: null },
    { nome: 'Mousa Al-Tamari', posicao: 'MEI', preco: 6, foto_url: null },
    { nome: 'Mohammad Abu Hasheesh', posicao: 'MEI', preco: 5, foto_url: null },
    { nome: 'Yazan Al-Naimat', posicao: 'ATA', preco: 6, foto_url: null },
    { nome: 'Ali Olwan', posicao: 'ATA', preco: 5, foto_url: null },
    { nome: 'Mahmoud Al-Mardi', posicao: 'ATA', preco: 5, foto_url: null },
  ],
 
  // 🇵🇾 PARAGUAI
  'Paraguai': [
    { nome: 'Carlos Coronel', posicao: 'GOL', preco: 6, foto_url: null },
    { nome: 'Gustavo Gómez', posicao: 'DEF', preco: 6, foto_url: null },
    { nome: 'Fabián Balbuena', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Junior Alonso', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Omar Alderete', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Mathías Villasanti', posicao: 'MEI', preco: 6, foto_url: null },
    { nome: 'Andrés Cubas', posicao: 'MEI', preco: 5, foto_url: null },
    { nome: 'Miguel Almirón', posicao: 'MEI', preco: 7, foto_url: null },
    { nome: 'Julio Enciso', posicao: 'ATA', preco: 7, foto_url: null },
    { nome: 'Alex Arce', posicao: 'ATA', preco: 6, foto_url: null },
    { nome: 'Ramón Sosa', posicao: 'ATA', preco: 6, foto_url: null },
  ],
 
  // 🇵🇦 PANAMÁ
  'Panamá': [
    { nome: 'Luis Mejía', posicao: 'GOL', preco: 6, foto_url: null },
    { nome: 'Michael Murillo', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Fidel Escobar', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Andrés Andrade', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Eric Davis', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Adalberto Carrasquilla', posicao: 'MEI', preco: 6, foto_url: null },
    { nome: 'Aníbal Godoy', posicao: 'MEI', preco: 5, foto_url: null },
    { nome: 'Édgar Bárcenas', posicao: 'MEI', preco: 6, foto_url: null },
    { nome: 'José Fajardo', posicao: 'ATA', preco: 6, foto_url: null },
    { nome: 'Ismael Díaz', posicao: 'ATA', preco: 6, foto_url: null },
    { nome: 'César Blackman', posicao: 'ATA', preco: 5, foto_url: null },
  ],
 
  // 🇧🇦 BÓSNIA E HERZEGOVINA
  'Bósnia H.': [
    { nome: 'Nikola Vasilj', posicao: 'GOL', preco: 6, foto_url: null },
    { nome: 'Amar Dedić', posicao: 'DEF', preco: 6, foto_url: null },
    { nome: 'Ermin Bičakčić', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Anel Ahmedhodžić', posicao: 'DEF', preco: 6, foto_url: null },
    { nome: 'Sead Kolašinac', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Miralem Pjanić', posicao: 'MEI', preco: 6, foto_url: null },
    { nome: 'Gojko Cimirot', posicao: 'MEI', preco: 5, foto_url: null },
    { nome: 'Amar Rahmanović', posicao: 'MEI', preco: 5, foto_url: null },
    { nome: 'Edin Džeko', posicao: 'ATA', preco: 6, foto_url: null },
    { nome: 'Ermedin Demirović', posicao: 'ATA', preco: 6, foto_url: null },
    { nome: 'Luka Menalo', posicao: 'ATA', preco: 5, foto_url: null },
  ],
 
  // 🇨🇩 RD CONGO
  'RD Congo': [
    { nome: 'Lionel Mpasi', posicao: 'GOL', preco: 6, foto_url: null },
    { nome: 'Chancel Mbemba', posicao: 'DEF', preco: 6, foto_url: null },
    { nome: 'Aaron Appindangoyé', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Dylan Batubinsika', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Arthur Masuaku', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Samuel Moutoussamy', posicao: 'MEI', preco: 6, foto_url: null },
    { nome: 'Gaël Kakuta', posicao: 'MEI', preco: 6, foto_url: null },
    { nome: 'Yoane Wissa', posicao: 'MEI', preco: 6, foto_url: null },
    { nome: 'Cédric Bakambu', posicao: 'ATA', preco: 6, foto_url: null },
    { nome: 'Simon Banza', posicao: 'ATA', preco: 6, foto_url: null },
    { nome: 'Théo Bongonda', posicao: 'ATA', preco: 5, foto_url: null },
  ],
 
  // 🇨🇮 COSTA DO MARFIM
  'Costa do Marfim': [
    { nome: 'Yahia Fofana', posicao: 'GOL', preco: 6, foto_url: null },
    { nome: 'Serge Aurier', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Eric Bailly', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Ousmane Diomande', posicao: 'DEF', preco: 6, foto_url: null },
    { nome: 'Ghislain Konan', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Seko Fofana', posicao: 'MEI', preco: 6, foto_url: null },
    { nome: 'Ibrahim Sangaré', posicao: 'MEI', preco: 6, foto_url: null },
    { nome: 'Franck Kessié', posicao: 'MEI', preco: 6, foto_url: null },
    { nome: 'Nicolas Pépé', posicao: 'ATA', preco: 6, foto_url: null },
    { nome: 'Sébastien Haller', posicao: 'ATA', preco: 7, foto_url: null },
    { nome: 'Simon Adingra', posicao: 'ATA', preco: 6, foto_url: null },
  ],
 
  // 🇨🇼 CURAÇAO
  'Curaçao': [
    { nome: 'Eloy Room', posicao: 'GOL', preco: 6, foto_url: null },
    { nome: 'Cuco Martina', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Juriën Gaari', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Roshon van Eijma', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Sherel Floranus', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Leandro Bacuna', posicao: 'MEI', preco: 6, foto_url: null },
    { nome: 'Juninho Bacuna', posicao: 'MEI', preco: 6, foto_url: null },
    { nome: 'Rangelo Janga', posicao: 'MEI', preco: 5, foto_url: null },
    { nome: 'Kenji Gorré', posicao: 'ATA', preco: 5, foto_url: null },
    { nome: 'Jafar Arias', posicao: 'ATA', preco: 5, foto_url: null },
    { nome: 'Gevaro Nepomuceno', posicao: 'ATA', preco: 5, foto_url: null },
  ],
}
 
// ============================================
// ⚪ TIER RUIM (6 seleções - 66 jogadores)
// Preços base: GOL: 5 | DEF: 4 | MEI: 5 | ATA: 6
// ============================================
 
const JOGADORES_RUIM = {
  
  // 🇿🇦 ÁFRICA DO SUL
  'África do Sul': [
    { nome: 'Ronwen Williams', posicao: 'GOL', preco: 5, foto_url: null },
    { nome: 'Khuliso Mudau', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Siyanda Xulu', posicao: 'DEF', preco: 4, foto_url: null },
    { nome: 'Nkosinathi Sibisi', posicao: 'DEF', preco: 4, foto_url: null },
    { nome: 'Terrence Mashego', posicao: 'DEF', preco: 4, foto_url: null },
    { nome: 'Teboho Mokoena', posicao: 'MEI', preco: 5, foto_url: null },
    { nome: 'Yusuf Maart', posicao: 'MEI', preco: 5, foto_url: null },
    { nome: 'Themba Zwane', posicao: 'MEI', preco: 5, foto_url: null },
    { nome: 'Percy Tau', posicao: 'ATA', preco: 6, foto_url: null },
    { nome: 'Evidence Makgopa', posicao: 'ATA', preco: 5, foto_url: null },
    { nome: 'Lyle Foster', posicao: 'ATA', preco: 5, foto_url: null },
  ],
 
  // 🇳🇿 NOVA ZELÂNDIA
  'Nova Zelândia': [
    { nome: 'Oliver Sail', posicao: 'GOL', preco: 5, foto_url: null },
    { nome: 'Liberato Cacace', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Nando Pijnaker', posicao: 'DEF', preco: 4, foto_url: null },
    { nome: 'Tommy Smith', posicao: 'DEF', preco: 4, foto_url: null },
    { nome: 'Bill Tuiloma', posicao: 'DEF', preco: 4, foto_url: null },
    { nome: 'Joe Bell', posicao: 'MEI', preco: 5, foto_url: null },
    { nome: 'Matthew Garbett', posicao: 'MEI', preco: 5, foto_url: null },
    { nome: 'Marko Stamenić', posicao: 'MEI', preco: 5, foto_url: null },
    { nome: 'Chris Wood', posicao: 'ATA', preco: 6, foto_url: null },
    { nome: 'Ben Waine', posicao: 'ATA', preco: 5, foto_url: null },
    { nome: 'Elijah Just', posicao: 'ATA', preco: 5, foto_url: null },
  ],
 
  // 🇭🇹 HAITI
  'Haiti': [
    { nome: 'Josué Duverger', posicao: 'GOL', preco: 5, foto_url: null },
    { nome: 'Ricardo Adé', posicao: 'DEF', preco: 4, foto_url: null },
    { nome: 'Carlens Arcus', posicao: 'DEF', preco: 4, foto_url: null },
    { nome: 'Jeppe Friborg', posicao: 'DEF', preco: 4, foto_url: null },
    { nome: 'Leverton Pierre', posicao: 'DEF', preco: 4, foto_url: null },
    { nome: 'Louicius Deedson', posicao: 'MEI', preco: 5, foto_url: null },
    { nome: 'Stéphane Lambese', posicao: 'MEI', preco: 5, foto_url: null },
    { nome: 'Francois Dulysse', posicao: 'MEI', preco: 5, foto_url: null },
    { nome: 'Duckens Nazon', posicao: 'ATA', preco: 5, foto_url: null },
    { nome: 'Frantzdy Pierrot', posicao: 'ATA', preco: 5, foto_url: null },
    { nome: 'Mondy Prunier', posicao: 'ATA', preco: 5, foto_url: null },
  ],
 
  // 🇺🇿 UZBEQUISTÃO
  'Uzbequistão': [
    { nome: 'Utkir Yusupov', posicao: 'GOL', preco: 5, foto_url: null },
    { nome: 'Khusniddin Alikulov', posicao: 'DEF', preco: 4, foto_url: null },
    { nome: 'Rustamjon Ashurmatov', posicao: 'DEF', preco: 4, foto_url: null },
    { nome: 'Anzur Ismailov', posicao: 'DEF', preco: 4, foto_url: null },
    { nome: 'Sherzod Nasrullayev', posicao: 'DEF', preco: 4, foto_url: null },
    { nome: 'Jaloliddin Masharipov', posicao: 'MEI', preco: 5, foto_url: null },
    { nome: 'Otabek Shukurov', posicao: 'MEI', preco: 5, foto_url: null },
    { nome: 'Abbosbek Fayzullaev', posicao: 'MEI', preco: 5, foto_url: null },
    { nome: 'Eldor Shomurodov', posicao: 'ATA', preco: 6, foto_url: null },
    { nome: 'Odiljon Hamrobekov', posicao: 'ATA', preco: 5, foto_url: null },
    { nome: 'Azizbek Turgunboev', posicao: 'ATA', preco: 5, foto_url: null },
  ],
 
  // 🇩🇿 ARGÉLIA
  'Argélia': [
    { nome: 'Rais M\'Bolhi', posicao: 'GOL', preco: 5, foto_url: null },
    { nome: 'Youcef Atal', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Ramy Bensebaini', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Aïssa Mandi', posicao: 'DEF', preco: 5, foto_url: null },
    { nome: 'Mohamed Amine Tougai', posicao: 'DEF', preco: 4, foto_url: null },
    { nome: 'Houssem Aouar', posicao: 'MEI', preco: 6, foto_url: null },
    { nome: 'Ramiz Zerrouki', posicao: 'MEI', preco: 5, foto_url: null },
    { nome: 'Youcef Belaïli', posicao: 'MEI', preco: 5, foto_url: null },
    { nome: 'Baghdad Bounedjah', posicao: 'ATA', preco: 5, foto_url: null },
    { nome: 'Islam Slimani', posicao: 'ATA', preco: 5, foto_url: null },
    { nome: 'Yassine Benzia', posicao: 'ATA', preco: 5, foto_url: null },
  ],
 
  // 🇨🇻 CABO VERDE
  'Cabo Verde': [
    { nome: 'Vozinha', posicao: 'GOL', preco: 5, foto_url: null },
    { nome: 'Steven Fortès', posicao: 'DEF', preco: 4, foto_url: null },
    { nome: 'Stopira', posicao: 'DEF', preco: 4, foto_url: null },
    { nome: 'Roberto Lopes', posicao: 'DEF', preco: 4, foto_url: null },
    { nome: 'Jamiro Monteiro', posicao: 'DEF', preco: 4, foto_url: null },
    { nome: 'Patrick Andrade', posicao: 'MEI', preco: 5, foto_url: null },
    { nome: 'Kenny Rocha', posicao: 'MEI', preco: 5, foto_url: null },
    { nome: 'Ryan Mendes', posicao: 'MEI', preco: 5, foto_url: null },
    { nome: 'Garry Rodrigues', posicao: 'ATA', preco: 5, foto_url: null },
    { nome: 'Jovane Cabral', posicao: 'ATA', preco: 5, foto_url: null },
    { nome: 'Hélio Varela', posicao: 'ATA', preco: 5, foto_url: null },
  ],
}
 
async function importarFracoERuim() {
  console.log('🔵⚪ Importando jogadores TIER FRACO + RUIM...\n')
  
  try {
    const selecoes = await prisma.selecao.findMany()
    const selecaoMap = {}
    selecoes.forEach(s => { selecaoMap[s.nome] = s.id })
    
    let total = 0
    
    // Importar FRACO
    console.log('🔵 === TIER FRACO ===\n')
    for (const [nomeSelecao, jogadores] of Object.entries(JOGADORES_FRACO)) {
      const selecaoId = selecaoMap[nomeSelecao]
      
      if (!selecaoId) {
        console.log(`❌ Seleção não encontrada: ${nomeSelecao}`)
        continue
      }
      
      console.log(`\n⚽ ${nomeSelecao.toUpperCase()}`)
      console.log('━'.repeat(70))
      
      for (const jog of jogadores) {
        const existe = await prisma.jogador.findFirst({
          where: { nome: jog.nome, selecaoId }
        })
        
        if (existe) {
          console.log(`⏭️  ${jog.nome.padEnd(30)} ${jog.posicao} ${jog.preco}💰`)
          continue
        }
        
        await prisma.jogador.create({
          data: {
            nome: jog.nome,
            posicao: jog.posicao,
            preco: jog.preco,
            foto_url: jog.foto_url,
            selecaoId
          }
        })
        
        console.log(`✅ ${jog.nome.padEnd(30)} ${jog.posicao} ${jog.preco}💰`)
        total++
      }
    }
    
    // Importar RUIM
    console.log('\n\n⚪ === TIER RUIM ===\n')
    for (const [nomeSelecao, jogadores] of Object.entries(JOGADORES_RUIM)) {
      const selecaoId = selecaoMap[nomeSelecao]
      
      if (!selecaoId) {
        console.log(`❌ Seleção não encontrada: ${nomeSelecao}`)
        continue
      }
      
      console.log(`\n⚽ ${nomeSelecao.toUpperCase()}`)
      console.log('━'.repeat(70))
      
      for (const jog of jogadores) {
        const existe = await prisma.jogador.findFirst({
          where: { nome: jog.nome, selecaoId }
        })
        
        if (existe) {
          console.log(`⏭️  ${jog.nome.padEnd(30)} ${jog.posicao} ${jog.preco}💰`)
          continue
        }
        
        await prisma.jogador.create({
          data: {
            nome: jog.nome,
            posicao: jog.posicao,
            preco: jog.preco,
            foto_url: jog.foto_url,
            selecaoId
          }
        })
        
        console.log(`✅ ${jog.nome.padEnd(30)} ${jog.posicao} ${jog.preco}💰`)
        total++
      }
    }
    
    console.log('\n' + '━'.repeat(70))
    console.log(`🎉 ${total} jogadores FRACO + RUIM importados!`)
    console.log('━'.repeat(70) + '\n')
    
  } catch (error) {
    console.error('💥 Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}
 
importarFracoERuim()