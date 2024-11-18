const places = [
    {
      name: "The Little Mermaid",
      address: "Langelinie, 2100 Copenhagen",
      coordinates: [
        { lat: 55.6929, lng: 12.5996 },
      ],
      admission: "Free",
      image: require('../assets/places/1.png'),
      history: "Unveiled in 1913, this iconic bronze statue was inspired by Hans Christian Andersen's famous fairy tale The Little Mermaid. Commissioned by Carl Jacobsen, the founder of Carlsberg, the statue was sculpted by Edvard Eriksen. Over the years, it has become a symbol of Copenhagen, despite its small size. The statue has experienced multiple acts of vandalism but is always restored to its original state.",
      touristInterest: "The statue is one of the most photographed landmarks in Copenhagen. Tourists are drawn to its scenic location by the harbor and its literary significance. Despite its small size, it’s a must-visit for its cultural symbolism."
    },
    {
      name: "Tivoli Gardens",
      address: "Vesterbrogade 3, 1630 Copenhagen",
      coordinates: [
        { lat: 55.6731, lng: 12.5683 },
      ],
      admission: "Paid (varies by ticket type)",
      image: require('../assets/places/2.png'),
      history: "Founded in 1843, Tivoli Gardens is the second-oldest operating amusement park in the world. Its creator, Georg Carstensen, wanted to create a fantasy world for people to escape the harshness of daily life. Tivoli has been updated over the years with rides, games, and gardens, while still maintaining its original charm. The park played an inspirational role in Walt Disney's vision of Disneyland.",
      touristInterest: "Tivoli offers a mix of thrilling rides, beautiful gardens, and live performances. It's a hub for cultural activities, seasonal events, and concerts, making it a top attraction for both families and thrill-seekers."
    },
    {
      name: "Nyhavn",
      address: "Nyhavn 1-71, 1051 Copenhagen",
      coordinates: [
        { lat: 55.6806, lng: 12.5912 },
      ],
      admission: "Free",
      image: require('../assets/places/3.png'),
      history: "Nyhavn was built in the late 17th century as a busy commercial port. The canal facilitated the transportation of goods to the city. In the 19th and early 20th centuries, it was known for its lively and sometimes seedy atmosphere, frequented by sailors. Today, the harbor has been transformed into a picturesque area filled with restaurants, cafés, and historical buildings.",
      touristInterest: "Visitors come for the colorful 17th and 18th-century townhouses that line the canal and the vibrant atmosphere. It’s a perfect spot for taking scenic photos, enjoying Danish cuisine, or hopping on a boat tour."
    },
    {
      name: "Amalienborg Palace",
      address: "Amalienborg Slotsplads 5, 1257 Copenhagen",
      coordinates: [
        { lat: 55.6849, lng: 12.5937 },
      ],
      admission: "Paid (for museum access)",
      image: require('../assets/places/4.png'),
      history: "Amalienborg Palace is the residence of the Danish royal family. It was originally built in the 1700s for noble families but was taken over by the royals after Christiansborg Palace burned down in 1794. The palace consists of four identical classical palace façades arranged around an octagonal courtyard. The royal family still resides there, and visitors can witness the daily changing of the guard.",
      touristInterest: "Tourists can visit the museum inside the palace, which showcases royal artifacts and interiors. The changing of the royal guards is a popular attraction, drawing crowds every day at noon."
    },
    {
      name: "Rosenborg Castle",
      address: "Øster Voldgade 4A, 1350 Copenhagen",
      coordinates: [
        { lat: 55.6854, lng: 12.5777 },
      ],
      admission: "Paid",
      image: require('../assets/places/5.png'),
      history: "Built in 1606 as a royal residence, Rosenborg Castle is a remarkable example of Dutch Renaissance architecture in Denmark. Christian IV, one of Denmark's most famous kings, used it as his summer residence. The castle is home to the Danish crown jewels and the Royal Regalia. Over the centuries, the castle has been preserved as a museum showcasing Denmark's royal history.",
      touristInterest: "Visitors can explore the ornate rooms and the treasury where the crown jewels are displayed. The castle gardens (Kongens Have) are equally popular for a peaceful walk."
    },
    {
      name: "Christiansborg Palace",
      address: "Prins Jørgens Gård 1, 1218 Copenhagen",
      coordinates: [
        { lat: 55.6756, lng: 12.5793 },
      ],
      admission: "Paid (for interior tours)",
      image: require('../assets/places/6.png'),
      history: "Christiansborg Palace stands on the site of the original Copenhagen Castle, built in the 12th century. It has been destroyed and rebuilt several times. The current palace, constructed in 1928, houses the Danish Parliament, the Supreme Court, and the Prime Minister's Office. Some areas are still used by the royal family for official events.",
      touristInterest: "Tourists can explore the royal reception rooms, the ruins of older structures beneath the palace, and the Tower, which offers stunning views of the city."
    },
    {
      name: "Round Tower (Rundetaarn)",
      address: "Købmagergade 52A, 1150 Copenhagen",
      coordinates: [
        { lat: 55.6815, lng: 12.5732 },
      ],
      admission: "Paid",
      image: require('../assets/places/7.png'),
      history: "Built in 1642 during the reign of Christian IV, the Round Tower was constructed as an astronomical observatory. It is one of the oldest functioning observatories in Europe. The unique spiral ramp leading to the top was designed to allow horses and carriages to access the observatory. Over time, the tower has served various scientific and cultural purposes.",
      touristInterest: "The panoramic view from the top is one of the main attractions. Visitors can also explore the library hall, which hosts exhibitions and concerts."
    },
    {
      name: "Freetown Christiania",
      address: "Refshalevej 2, 1436 Copenhagen",
      coordinates: [
        { lat: 55.6739, lng: 12.6058 },
      ],
      admission: "Free",
      image: require('../assets/places/8.png'),
      history: "Christiania was founded in 1971 when a group of hippies occupied an abandoned military base in the Christianshavn district. They established an alternative community based on collective ownership and anarchist principles. Over the years, it has been a haven for artists and free thinkers, though it has also been controversial due to its relaxed stance on drug use.",
      touristInterest: "Visitors come for its bohemian atmosphere, street art, and unique communal lifestyle. Guided tours provide insight into its history, and it’s a vibrant spot for local art and music."
    },
    {
      name: "Copenhagen Opera House",
      address: "Ekvipagemestervej 10, 1438 Copenhagen",
      coordinates: [
        { lat: 55.6841, lng: 12.5989 },
      ],
      admission: "Paid (for performances or tours)",
      image: require('../assets/places/9.png'),
      history: "Opened in 2005, the Copenhagen Opera House is one of the most modern and expensive opera houses in the world. The building was designed by Danish architect Henning Larsen and funded by the A.P. Møller Foundation. The design of the opera house has been praised for its acoustics and modern aesthetics, and it holds a significant place in Copenhagen’s cultural landscape.",
      touristInterest: "The Opera House is visually striking, situated right on the harbor. Visitors can attend world-class performances or take a guided architectural tour."
    },
    {
      name: "Copenhagen Casino",
      address: "21, 1570 Copenhagen",
      coordinates: [
        { lat: 55.6746, lng: 12.5649 },
      ],
      admission: "Free entry (age restrictions apply)",
      image: require('../assets/places/10.png'),
      history: "Established in 1995, Copenhagen Casino has become a central hub for entertainment and gaming in the city. Located in the vibrant area of Vesterbro, it offers a modern and stylish setting for both locals and tourists. The casino features a wide range of gaming options, including poker, blackjack, and various slot machines, along with live entertainment and events throughout the year.",
      touristInterest: "Guests are attracted to the lively atmosphere, the chance to try their luck at various games, and the upscale dining options available. Whether you're an experienced player or just looking for a fun night out, Copenhagen Casino provides an exciting escape in the heart of the city."
    }
  ];

export default places;