import { RESET, SET_AGENCE, SET_ANNULER_DATE, SET_ANNULER_DEMANDE_DATE, SET_ANNULER_DEMANDE_TIME, SET_ANNULER_TIME, SET_ANNULE_PAR, SET_AUTRE_CLIENT, SET_AUTRE_DESTINATION, SET_AUTRE_INCIDENT, SET_AUTRE_PICKUP, SET_CLIENT, SET_COMMENTAIRE, SET_CORPORATE, SET_COVOITURAGE, SET_DEBUT, SET_DESTINATION, SET_DUREE, SET_INCIDENT, SET_INCIDENT_TYPE, SET_KILOMETRE, SET_LOADING, SET_MONTANT, SET_NUMERO_COURSE, SET_PICKUP, SET_RAISON, SET_RAISON_ANNULATION, SET_ROUTE, SET_STICKY_HEADER, SET_TIME, SET_TYPE } from "../reducers/appReducer"

export const setRouteAction = ( route ) => {
          return {
                    type: SET_ROUTE,
                    payload: route
          }
}

export const setLoadingAction = ( bool ) => {
          return {
                    type: SET_LOADING,
                    payload: bool
          }
}

export const setStickyAction = ( bool ) => {
          return {
                    type: SET_STICKY_HEADER,
                    payload: bool
          }
}

export const setTypeAction = ( type ) => {
          return {
                    type: SET_TYPE,
                    payload: type
          }
}

export const setCorporateAction = ( corporate ) => {
          return {
                    type: SET_CORPORATE,
                    payload: corporate
          }
}

export const setClientAction = ( client ) => {
          return {
                    type: SET_CLIENT,
                    payload: client
          }
}

export const setAutreClientAction = ( client ) => {
          return {
                    type: SET_AUTRE_CLIENT,
                    payload: client
          }
}

export const setCovoiturageAction = ( cov ) => {
          return {
                    type: SET_COVOITURAGE,
                    payload: cov
          }
}

export const setAnnulerParAction = ( per ) => {
          return {
                    type: SET_ANNULE_PAR,
                    payload: per
          }
}

export const setRaisonAnnulationAction = ( raison ) => {
          return {
                    type: SET_RAISON_ANNULATION,
                    payload: raison
          }
}

export const setRaisonAction = ( raison ) => {
          return {
                    type: SET_RAISON,
                    payload: raison
          }
}

export const setDemandeDate = ( date ) => {
          return {
                    type: SET_ANNULER_DEMANDE_DATE,
                    payload: date
          }
}

export const setDemandeTime = ( time ) => {
          return {
                    type: SET_ANNULER_DEMANDE_TIME,
                    payload: time
          }
}

export const setAnnulerDate = ( date ) => {
          return {
                    type: SET_ANNULER_DATE,
                    payload: date
          }
}

export const setAnnulerTime = ( time ) => {
          return {
                    type: SET_ANNULER_TIME,
                    payload: time
          }
}

export const setAgenceAction = ( agence ) => {
          return {
                    type: SET_AGENCE,
                    payload: agence
          }
}

export const setPickupAction = ( pickup ) => {
          return {
                    type: SET_PICKUP,
                    payload: pickup
          }
}

export const setAutrePickupAction = ( pickup ) => {
          return {
                    type: SET_AUTRE_PICKUP,
                    payload: pickup
          }
}

export const setDestinationAction = ( destination ) => {
          return {
                    type: SET_DESTINATION,
                    payload: destination
          }
}

export const setAutreDestinationAction = ( destination ) => {
          return {
                    type: SET_AUTRE_DESTINATION,
                    payload: destination
          }
}

export const setKilometreAction = ( kilometre ) => {
          return {
                    type: SET_KILOMETRE,
                    payload: kilometre
          }
}

export const setDureeAction = ( duree ) => {
          return {
                    type: SET_DUREE,
                    payload: duree
          }
}

export const setMontantAction = ( montant ) => {
          return {
                    type: SET_MONTANT,
                    payload: montant
          }
}

export const setIncidentAction = ( bool ) => {
          return {
                    type: SET_INCIDENT,
                    payload: bool
          }
}

export const setIncidentTypeAction = ( incident ) => {
          return {
                    type: SET_INCIDENT_TYPE,
                    payload: incident
          }
}

export const setAutreIncidentAction = ( incident ) => {
          return {
                    type: SET_AUTRE_INCIDENT,
                    payload: incident
          }
}

export const setCommentAction = ( comment ) => {
          return {
                    type: SET_COMMENTAIRE,
                    payload: comment
          }
}

export const setDateDebutAction = ( dateDebut ) => {
          return {
                    type: SET_DEBUT,
                    payload: dateDebut
          }
}

export const setTimeAction = ( time ) => {
          return {
                    type: SET_TIME,
                    payload: time
          }
}

export const setNumeroCourseAction = ( numero ) => {
          return {
                    type: SET_NUMERO_COURSE,
                    payload: numero
          }
}

export const resetAction= () => {
          return {
                    type: RESET
          }
}