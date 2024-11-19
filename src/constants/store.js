const store = [
    {
      name: "National Museum of Denmark",
      address: "Ny Vestergade 10, 1471 Copenhagen",
      coordinates: [
        { lat: 55.6743, lng: 12.5734 },
      ],
      admission: "Paid",
      image: require('../assets/store/1.png'),
      history: "The National Museum of Denmark houses a vast collection of Danish cultural history. Established in 1807, the museum showcases artifacts ranging from the Stone Age to the Viking era, as well as international collections. It offers insights into Denmark's heritage and its historical connections with the wider world.",
      touristInterest: "Popular exhibits include the Viking treasures, medieval church art, and the Egtved Girl’s well-preserved remains from the Bronze Age."
    },
    {
      name: "Carlsberg Glyptotek",
      address: "Dantes Plads 7, 1556 Copenhagen",
      coordinates: [
        { lat: 55.6717, lng: 12.5663 },
      ],
      admission: "Paid (free on Tuesdays)",
      image: require('../assets/store/2.png'),
      history: "Founded by Carl Jacobsen, the brewer behind Carlsberg, the Glyptotek opened in 1897 as an art museum. Its collections span over 6,000 years, focusing on ancient Mediterranean civilizations, French Impressionists, and Danish art. The museum is known for its extensive sculpture collection, which gives it the name Glyptotek, meaning 'a collection of sculptures.'",
      touristInterest: "Visitors are drawn to the beautiful winter garden, the impressive art collections, and the tranquil atmosphere of the museum."
    },
    {
      name: "Kastellet",
      address: "Gl. Hovedvagt, Kastellet 1, 2100 Copenhagen",
      coordinates: [
        { lat: 55.6921, lng: 12.5948 },
      ],
      admission: "Free",
      image: require('../assets/store/3.png'),
      history: "Kastellet is a well-preserved star-shaped fortress dating back to the 17th century, originally built as part of the city's defenses by King Christian IV. It played a key role in protecting Copenhagen from attacks over the centuries, though it has since been demilitarized. Today, Kastellet functions as a public park and cultural heritage site.",
      touristInterest: "Tourists enjoy walking along the ramparts and exploring the historic buildings. It offers scenic views of the harbor and is a peaceful place to take in Danish history."
    },
  ];
  
export default store;