export const SET_ROUTE = "SET_ROUTE"
export const SET_LOADING = "SET_LOADING"
export const SET_STICKY_HEADER = "SET_STICKY_HEADER"
export const SET_TYPE = "SET_TYPE"
export const SET_CORPORATE= "SET_CORPORATE"
export const SET_CLIENT= "SET_CLIENT"
export const SET_AUTRE_CLIENT = "SET_AUTRE_CLIENT"
export const SET_COVOITURAGE  = "SET_COVOITURAGE"
export const SET_ANNULE_PAR = "SET_ANNULE_PAR"
export const SET_RAISON_ANNULATION = "SET_RAISON_ANNULATION"
export const SET_RAISON = "SET_RAISON"
export const SET_ANNULER_DEMANDE_DATE = "SET_ANNULER_DEMANDE_DATE"
export const SET_ANNULER_DEMANDE_TIME = "SET_ANNULER_DEMANDE_TIME"
export const SET_ANNULER_DATE = "SET_ANNULER_DATE"
export const SET_ANNULER_TIME = "SET_ANNULER_TIME"
export const SET_AGENCE = "SET_AGENCE"
export const SET_PICKUP = "SET_PICKUP"
export const SET_AUTRE_PICKUP = "SET_AUTRE_PICKUP"
export const SET_DESTINATION = "SET_DESTINATION"
export const SET_AUTRE_DESTINATION = "SET_AUTRE_DESTINATION"
export const SET_KILOMETRE  = "SET_KILOMETRE"
export const SET_DUREE = "SET_DUREE"
export const SET_MONTANT = "SET_MONTANT"
export const SET_INCIDENT  = "SET_INCIDENT"
export const SET_INCIDENT_TYPE = "SET_INCIDENT_TYPE"
export const SET_AUTRE_INCIDENT = "SET_AUTRE_INCIDENT"
export const SET_DEBUT = "SET_DEBUT"
export const SET_TIME = "SET_TIME"
export const SET_COMMENTAIRE = "SET_COMMENTAIRE"
export const SET_NUMERO_COURSE = "SET_NUMERO_COURSE"
export const RESET = "RESET"
export const SET_PUSH_NOTIFICATION_TOKEN = 'SET_PUSH_NOTIFICATION_TOKEN'

const initials = {
          route: 'DeclarationType',
          loading: false,
          stickyHeader: false,
          pushNotificationToken: null,
          type: null,
          corporate: null,
          client: null,
          autreClient: null,
          covoiturage: null,
          annulePar: null,
          raisonAnnulation: null,
          raison: null,
          demandeDate: null,
          demandeTime: null,
          annulerDate: null,
          annulerTime: null,
          agence: null,
          pickup: null,
          autrePickUp: null,
          destination: null,
          autreDestination: null,
          kilometre: null,
          duree: null,
          montant: null,
          incident: false,
          typeIncident: null,
          autreIncident: null,
          commentaire: null,
          dateDebut: null,
          time: null,
          numeroCourse: ''
}
export default function appReducer(app = initials, action) {
          switch (action.type) {
                    case SET_ROUTE:
                              return {...app, route: action.payload}
                    case SET_LOADING:
                              return {...app, loading: action.payload}
                    case SET_STICKY_HEADER:
                              return {...app, stickyHeader: action.payload}
                    case SET_PUSH_NOTIFICATION_TOKEN:
                              return {...app, pushNotificationToken: action.payload}
                    case SET_TYPE:
                              return {...app, type: action.payload}
                    case SET_CORPORATE:
                              return {...app, corporate: action.payload}
                    case SET_CLIENT:
                              return {...app, client: action.payload}
                    case SET_AUTRE_CLIENT:
                              return {...app, autreClient: action.payload}
                    case SET_COVOITURAGE:
                              return {...app, covoiturage: action.payload}
                    case SET_ANNULE_PAR:
                              return {...app, annulePar: action.payload}
                    case SET_RAISON_ANNULATION:
                              return {...app, raisonAnnulation: action.payload}
                    case SET_RAISON:
                              return {...app, raison: action.payload}
                    case SET_ANNULER_DEMANDE_DATE:
                              return {...app, demandeDate: action.payload}
                    case SET_ANNULER_DEMANDE_TIME:
                              return {...app, demandeTime: action.payload}
                    case SET_ANNULER_DATE:
                              return {...app, annulerDate: action.payload}
                    case SET_ANNULER_TIME:
                              return {...app, annulerTime: action.payload}
                    case SET_AGENCE:
                              return {...app, agence: action.payload}
                    case SET_PICKUP:
                              return {...app, pickup: action.payload}
                    case SET_AUTRE_PICKUP:
                              return {...app, autrePickUp: action.payload}
                    case SET_AUTRE_DESTINATION:
                              return {...app, autreDestination: action.payload}
                    case SET_DESTINATION:
                              return {...app, destination: action.payload}
                    case SET_KILOMETRE:
                              return {...app, kilometre: action.payload}
                    case SET_DUREE:
                              return {...app, duree: action.payload}
                    case SET_MONTANT:
                              return {...app, montant: action.payload}
                    case SET_INCIDENT:
                              return {...app, incident: action.payload}
                    case SET_INCIDENT_TYPE:
                              return {...app, typeIncident: action.payload}
                    case SET_AUTRE_INCIDENT:
                              return {...app, autreIncident: action.payload}
                    case SET_COMMENTAIRE:
                              return {...app, commentaire: action.payload}
                    case SET_DEBUT:
                              return {...app, dateDebut: action.payload}
                    case SET_TIME:
                              return {...app, time: action.payload}
                    case SET_NUMERO_COURSE: 
                              return {...app, numeroCourse: action.payload}
                    case RESET:
                              return initials
                    default:
                              return app
          }
}