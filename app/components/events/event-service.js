'use strict';

angular.module('myApp.events.event-service', [
])

    .factory('event-service', function commonProp($firebaseArray, $firebaseObject, CommonProp) {

        return {
            getEventInfo: function(id) {
                // RICHIESTA DELL'OGGETTO UTENTE PRESENTE NEL DATABASE "calendario"
                // DI FIREBASE MEDIANTE PASSAGGIO DELL'ID (IDENTIFICATORE UNIVOCO)

                var userRef = firebase.database().ref().child("calendario").child(id);
                return $firebaseObject(userRef);
            },

            getAllEvent: function(){

                // ARRAY DI TUTTI GLI EVENTI REGISTRATI NEL DATABASE
                var ref = firebase.database().ref().child("calendario");
                return $firebaseArray(ref);
            },

            creaNuovoEvento: function(evento, data, id){

                    // AGGIUNTA NUOVO UTENTE AL DATABASE
                    var ref = firebase.database().ref().child("calendario");
                    var elencoEventi = $firebaseArray(ref);

                    console.log(data);

                    elencoEventi.$add({
                        IDcreatore: id,
                        descrizione: evento.descrizione,
                        giorno: data,
                        luogo: evento.luogo,
                        oraI: evento.oraI,
                        oraF: evento.oraF,
                        tipo: evento.tipo,
                        titolo: evento.titolo
                    }).then(function (ref) {
                        console.log(ref);
                    }, function (error){
                        console.log(error);
                    });

                    console.log("Evento Aggiunto Correttamente!");

            }

        };
    });