const getFloraFauna = async () => {
    const latitude = 6.2289
    const longitude = -75.5908
    const radius = 10000
    const response = await fetch('https://api.gbif.org/v1/occurrence/search/?decimalLatitude=5.694722&decimalLongitude=-76.661111&radius=1000&limit=50&offset=0');
    const data = await response.json();
    return data;
}
getFloraFauna().then(data => console.log(data));

export { getFloraFauna }