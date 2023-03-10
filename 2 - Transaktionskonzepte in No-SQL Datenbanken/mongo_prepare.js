// Traditioneller NoSQL Ansatz (Denormalisiert)
db.myCollection.insertMany( [
    { "name": "Anton", "abteilung": "Einkauf" },
    { "name": "Berta", "abteilung": "Verkauf" } ] )

// Traditioneller SQL Ansatz (Normalisiert)
abt_einkauf = db.abteilung.insertOne( { "bezeichnung": "Einkauf" } )
db.mitarbeiter.insertOne( { "name": "Anton", "abt_id": abt_einkauf.insertedId } )

abt_verkauf = db.abteilung.insertOne( { "bezeichnung": "Verkauf" } )
db.mitarbeiter.insertOne( { "name": "Berta", "abt_id": abt_verkauf.insertedId } )
