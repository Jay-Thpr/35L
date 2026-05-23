import requests
from sqlalchemy import text
from app.db import SessionLocal
from app.config import get_settings

IMDB_IDS = [
    "tt0111161", "tt0068646", "tt0071562", "tt0468569", "tt0050083",
    "tt0108052", "tt0167260", "tt0110912", "tt0060196", "tt0120737",
    "tt0109830", "tt0167261", "tt0080684", "tt0137523", "tt0133093",
    "tt0099685", "tt0073486", "tt0114369", "tt0317248", "tt0816692",
    "tt0102926", "tt0076759", "tt0038650", "tt0118799", "tt0114814",
    "tt0245429", "tt0120815", "tt0120689", "tt0110413", "tt0054215",
    "tt0253474", "tt0407887", "tt0103064", "tt2582802", "tt0088763",
    "tt0172495", "tt0078788", "tt0047478", "tt0027977", "tt0021749",
    "tt0064116", "tt0034583", "tt0095765", "tt0095327", "tt0119698",
    "tt0211915", "tt0482571", "tt0209144", "tt0114709", "tt0435761",
    "tt0078748", "tt0090605", "tt0082971", "tt0083658", "tt0086190",
    "tt0993846", "tt1853728", "tt1345836", "tt0405094", "tt0050212",
    "tt0056172", "tt1187043", "tt0119488", "tt0405159", "tt0457430",
    "tt0364569", "tt6751668", "tt1832382", "tt0036775", "tt0056592",
    "tt0986264", "tt0091251", "tt0046438", "tt0070735", "tt0066921",
    "tt0062622", "tt0081505", "tt0119217", "tt0086879", "tt0169547",
    "tt2380307", "tt0382932", "tt0317705", "tt0892769", "tt0198781",
    "tt0266543", "tt0910970", "tt1049413", "tt0096283", "tt0050976",
    "tt0053604", "tt0040522", "tt5311514", "tt0042876", "tt0089881",
    "tt0246578", "tt0073195", "tt0093058", "tt0098635", "tt0095016",
    "tt0095953", "tt0091763", "tt0033467", "tt0017136", "tt0046268",
    "tt0040897", "tt0093779", "tt0118715", "tt6710474", "tt7286456",
    "tt6644200", "tt5052448", "tt6857112", "tt8579674", "tt2911666",
    "tt4154756", "tt4154796", "tt0848228", "tt2395427", "tt0371746",
    "tt1228705", "tt1300854", "tt0800080", "tt0800369", "tt1981115",
    "tt3501632", "tt1843866", "tt0458339", "tt3498820", "tt2015381",
    "tt3896198", "tt6791350", "tt1211837", "tt1825683", "tt9032400",
    "tt6320628", "tt2250912", "tt10872600", "tt9362722", "tt4633694",
    "tt0145487", "tt1872181", "tt0316654", "tt0413300", "tt2294629",
    "tt4520988", "tt0903624", "tt1170358", "tt2310332", "tt1392170",
    "tt1951264", "tt0241527", "tt0295297", "tt0304141", "tt0330373",
    "tt0373889", "tt0417741", "tt0926084", "tt1201607", "tt2527336",
    "tt2488496", "tt0121765", "tt0120915", "tt2935510", "tt0107290",
    "tt0119567", "tt0163025", "tt0369610", "tt4881806", "tt8041270",
    "tt1856101", "tt1392214", "tt2543164", "tt5174640", "tt15239678",
    "tt3661394", "tt1764651", "tt2278388", "tt15097216", "tt0092099",
    "tt9243946", "tt2382320", "tt0830515", "tt0381061", "tt6105098",
    "tt0110357", "tt9376612", "tt9419884", "tt6334354", "tt1877830",
    "tt0096874", "tt0099088", "tt0107048", "tt0099487", "tt0114898",
    "tt0113277", "tt5715874", "tt8772262", "tt7349662", "tt6966692",
    "tt4154664", "tt5363618", "tt3315342", "tt1431045", "tt5463162",
    "tt6263850", "tt0758758", "tt2980516", "tt0317219", "tt0892791",
    "tt5848272", "tt7146812", "tt2948372", "tt12801262", "tt8629748",
    "tt15398776", "tt1517268", "tt1502712", "tt0440963", "tt0372183",
    "tt0258463", "tt5108870", "tt5719748", "tt10648342", "tt0162222",
    "tt0264464", "tt0469494", "tt2024544", "tt1454468", "tt1727824",
    "tt7784604", "tt0099785", "tt0083866", "tt2562232", "tt0144084",
    "tt0103639", "tt1630029", "tt0499549", "tt10366206", "tt11315808",
    "tt1010048", "tt0454921", "tt0073629", "tt0058331", "tt0119250",
    "tt8946378", "tt0091042", "tt0117509", "tt0405422", "tt0780504",
    "tt0454876", "tt1454029", "tt2278871", "tt1707386", "tt0418819",
    "tt0407304", "tt0117951", "tt0335266", "tt0119094", "tt1142988",
    "tt0287467", "tt0144117", "tt1486190", "tt0190332", "tt0405422",
    "tt1392190", "tt1300851", "tt0167190", "tt0381849", "tt0118749",
    "tt0286106", "tt0314331", "tt0286106", "tt1798709", "tt2674426",
    "tt0993846", "tt2872732", "tt0454841", "tt0822854", "tt0457939",
    "tt0993842", "tt0432283", "tt0808151", "tt0457513", "tt0432291",
]


def clean(v):
    if v is None or v == "N/A" or v == "":
        return None
    return v


def parse_year(y):
    y = clean(y)
    if not y:
        return None
    
    return int(y[:4])


def parse_runtime(r):
    r = clean(r)
    if not r:
        return None
    
    return int(r.split()[0])


def fetch(imdb_id, api_key):
    r = requests.get(
        "http://www.omdbapi.com/",
        params={"i": imdb_id, "apikey": api_key},
        timeout=10,
    )
    data = r.json()
    if data.get("Response") != "True":
        return None
    return data


def main():
    settings = get_settings()

    session = SessionLocal()
    existing = session.execute(text("SELECT COUNT(*) FROM movies")).scalar()
    if existing > 0:
        session.close()
        return

    ids = list(dict.fromkeys(IMDB_IDS))
    inserted = 0
    for imdb_id in ids:
        data = fetch(imdb_id, settings.omdb_api_key)
        if not data:
            continue
        session.execute(
            text(
                "INSERT INTO movies (title, plot, genres, director, cast_list, release_year, runtime_min) "
                "VALUES (:title, :plot, :genres, :director, :cast_list, :release_year, :runtime_min)"
            ),
            {
                "title": clean(data.get("Title")),
                "plot": clean(data.get("Plot")),
                "genres": clean(data.get("Genre")),
                "director": clean(data.get("Director")),
                "cast_list": clean(data.get("Actors")),
                "release_year": parse_year(data.get("Year")),
                "runtime_min": parse_runtime(data.get("Runtime")),
            },
        )
        inserted += 1
        print(f"{inserted}: {data.get('Title')}")

    session.commit()
    session.close()

main()
