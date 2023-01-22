// Start a session.
session = db.getMongo().startSession( { readPreference: { mode: "primary" } } );
mitarbeiter = session.getDatabase("db").mitarbeiter;
abteilung = session.getDatabase("db").abteilung;

// Start a transaction
session.startTransaction( { readConcern: { level: "local" }, writeConcern: { w: "majority" } } );

// Operations inside the transaction
try {
   abt_marketing = abteilung.insertOne( { bezeichnung: "Marketing" } );
   mitarbeiter.insertOne( { name: "Carla", "abt_id": abt_marketing.insertedId } );
} catch (error) {
   // Abort transaction on error
   session.abortTransaction();
   throw error;
}

// Commit the transaction using write concern set at transaction start
session.commitTransaction();
session.endSession();
