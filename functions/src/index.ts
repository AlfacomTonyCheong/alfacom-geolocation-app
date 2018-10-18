import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

admin.initializeApp();
const db = admin.firestore();

export const complaintComment_DocumentWriteListener =
    functions.firestore.document('complaintSocialData/{documentUid}/comments/{commentDocUid}')
        .onWrite((change, context) => {
            const documentUid = context.params.documentUid;
            const docPath = 'complaintSocialData/' + documentUid;
            console.log('ComplaintCommentDocumentOnWrite parent: ' + docPath);
            if (!change.before.exists) {
                // New document Created : add one to count
                const docRef = db.doc(docPath);
                return db.runTransaction((transaction) => {
                    return transaction.get(docRef).then(snap => {
                        if (snap.exists && snap.data().commentCount) {
                            transaction.update(docRef, { commentCount: snap.data().commentCount + 1 });
                        }
                        else {
                            transaction.set(docRef, { commentCount: 1 }, { merge: true });
                        }
                    }).catch(error => {
                        throw error;
                    });
                }).then(() => {
                    console.log('Transaction successfully committed.');
                }).catch((error) => {
                    console.error('Transaction failed: ' + error);
                })

                // db.doc(docPath).get().then(snap => {
                //     if (snap.exists && snap.data().commentCount) {
                //         db.doc(docPath).update({ commentCount: snap.data().commentCount + 1 }).then(() => {
                //             return true;
                //         }).catch(error => {
                //             console.error(error);
                //         });
                //     }
                //     else {
                //         db.doc(docPath).set({ commentCount: 1 }, { merge: true }).then(() => {
                //             return true;
                //         }).catch(error => {
                //             console.error(error);
                //         });
                //     }
                // }).catch(error => {
                //     console.error(error);
                // });

            } else if (change.before.exists && change.after.exists) {
                // Updating existing document : Do nothing
                return true;

            } else if (!change.after.exists) {
                // Deleting document : subtract one from count
                const docRef = db.doc(docPath);
                return db.runTransaction((transaction) => {
                    return transaction.get(docRef).then(snap => {
                        transaction.update(docRef, { commentCount: snap.data().commentCount - 1 })
                    }).catch(error => {
                        throw error;
                    });
                }).then(() => {
                    console.log('Transaction successfully committed.');
                }).catch((error) => {
                    console.error('Transaction failed: ' + error);
                })

                // db.doc(docPath).get().then(snap => {
                //     db.doc(docPath).update({ commentCount: snap.data().commentCount - 1 }).then(() => {
                //         return true;
                //     }).catch(error => {
                //         console.error(error);
                //     });
                // }).catch(error => {
                //     console.log(error);
                // });
            }
            return false;
        });

export const complaintLike_DocumentWriteListener =
    functions.firestore.document('complaintSocialData/{documentUid}/likes/{likeDocUid}')
        .onWrite((change, context) => {
            const documentUid = context.params.documentUid;
            const docPath = 'complaintSocialData/' + documentUid;
            console.log('ComplaintLikeDocumentOnWrite parent: ' + docPath);
            if (!change.before.exists) {
                // New document Created : add one to count
                const docRef = db.doc(docPath);
                return db.runTransaction((transaction) => {
                    return transaction.get(docRef).then(snap => {
                        if (snap.exists && snap.data().likeCount) {
                            transaction.update(docRef, { likeCount: snap.data().likeCount + 1 });
                        }
                        else {
                            transaction.set(docRef, { likeCount: 1 }, { merge: true });
                        }
                    }).catch(error => {
                        throw error;
                    });
                }).then(() => {
                    console.log('Transaction successfully committed.');
                }).catch((error) => {
                    console.error('Transaction failed: ' + error);
                })
                
                // db.doc(docPath).get().then(snap => {
                //     if (snap.exists && snap.data().likeCount) {
                //         db.doc(docPath).update({ likeCount: snap.data().likeCount + 1 }).then(() => {
                //             return true;
                //         }).catch(error => {
                //             console.error(error);
                //         });
                //     }
                //     else {
                //         db.doc(docPath).set({ likeCount: 1 }, { merge: true }).then(() => {
                //             return true;
                //         }).catch(error => {
                //             console.error(error);
                //         });
                //     }
                // }).catch(error => {
                //     console.error(error);
                // });

            } else if (change.before.exists && change.after.exists) {
                // Updating existing document : Do nothing
                return true;

            } else if (!change.after.exists) {
                // Deleting document : subtract one from count
                const docRef = db.doc(docPath);
                return db.runTransaction((transaction) => {
                    return transaction.get(docRef).then(snap => {
                        transaction.update(docRef, { likeCount: snap.data().likeCount - 1 })
                    }).catch(error => {
                        throw error;
                    });
                }).then(() => {
                    console.log('Transaction successfully committed.');
                }).catch((error) => {
                    console.error('Transaction failed: ' + error);
                })

                // db.doc(docPath).get().then(snap => {
                //     db.doc(docPath).update({ likeCount: snap.data().likeCount - 1 }).then(() => {
                //         return true;
                //     }).catch(error => {
                //         console.error(error);
                //     });
                // }).catch(error => {
                //     console.log(error);
                // });
            }
            return false;
        });