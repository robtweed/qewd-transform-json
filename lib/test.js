/*

 ----------------------------------------------------------------------------
 | qewd-transform-json: Transform JSON using a template                     |
 |                                                                          |
 | Copyright (c) 2016-17 M/Gateway Developments Ltd,                        |
 | Redhill, Surrey UK.                                                      |
 | All rights reserved.                                                     |
 |                                                                          |
 | http://www.mgateway.com                                                  |
 | Email: rtweed@mgateway.com                                               |
 |                                                                          |
 |                                                                          |
 | Licensed under the Apache License, Version 2.0 (the "License");          |
 | you may not use this file except in compliance with the License.         |
 | You may obtain a copy of the License at                                  |
 |                                                                          |
 |     http://www.apache.org/licenses/LICENSE-2.0                           |
 |                                                                          |
 | Unless required by applicable law or agreed to in writing, software      |
 | distributed under the License is distributed on an "AS IS" BASIS,        |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. |
 | See the License for the specific language governing permissions and      |
 |  limitations under the License.                                          |
 ----------------------------------------------------------------------------

  28 March 2017

*/

var transform = require('./transform');

function test() {

  var data = {
    discharge_summary: {
      "_uid": "16cad9dd-cc4b-42f8-b7b2-980835d9e977::ripple_osi.ehrscape.c4h::1",
      "language|code": "en",
      "language|terminology": "ISO_639-1",
      "territory|code": "GB",
      "territory|terminology": "ISO_3166-1",
      "context": {
        "_health_care_facility|id": "904",
        "_health_care_facility|id_scheme": "iEHR",
        "_health_care_facility|id_namespace": "iEHR",
        "_health_care_facility|name": "St.James's Hospital (Dublin)",
        "patient_identifiers": {
          "mrn": "9999999000",
          "mrn|issuer": "iEHR",
          "mrn|assigner": "iEHR",
          "mrn|type": "MRN",
          "oth": "1020714",
          "oth|issuer": "iEHR",
          "oth|assigner": "iEHR",
          "oth|type": "OTH",
          "gms": "-",
          "gms|issuer": "iEHR",
          "gms|assigner": "iEHR",
          "gms|type": "GMS"
        },
        "start_time": "2010-05-14T00:00:00Z",
        "setting|code": "238",
        "setting|value": "other care",
        "setting|terminology": "openehr"
      },
      "discharge_details": {
        "discharge_details_uk_v1": {
          "responsible_professional": {
            "professional_name": {
              "name": "COOKE MR FIACHRA"
            },
            "professional_identifier": "4547",
            "professional_identifier|issuer": "iEHR",
            "professional_identifier|assigner": "iEHR",
            "professional_identifier|type": "MCN"
          },
          "language|code": "en",
          "language|terminology": "ISO_639-1",
          "encoding|code": "UTF-8",
          "encoding|terminology": "IANA_character-sets"
        }
      },
      "diagnoses": {
        "problem_diagnosis": [
          {
            "problem_diagnosis_name": "Cholecystectomy",
            "problem_diagnosis_status": {
              "diagnostic_status|code": "at0017",
              "diagnostic_status|value": "Working",
              "diagnostic_status|terminology": "local"
            },
            "language|code": "en",
            "language|terminology": "ISO_639-1",
            "encoding|code": "UTF-8",
            "encoding|terminology": "IANA_character-sets"
          }
        ]
      },
      "clinical_summary": {
        "clinical_synopsis": {
          "synopsis": "ADMISSION REASON: Admit with acute abdominal pain, deranged LFTs, normal amylase DIAGNOSIS: Cholecystectomy PROBLEMS: Abdominal pain PROBLEMS: Gallstones THEATRE PROCS: Lap Chole NON THEATRE PROCS: None LAB INVESTIGATIONS: As attached - FBC, UE, LFTs, Amylase RAD INVESTIGATIONS: As attached - USS Abdomen, MRCP OTHER INVESTIGATIONS: None PROGRESS DURING STAY: Uncomplicated post operative recovery.Full diet tolerated, wound sites dry and intact, no oozing. Vital signs normal, apyrexial. Mobilising/teds/clexane. No c/o abdominal pain. C/O right shoulder tip pain - advised post operative complication and should resolve within several days. Normal MRCP pre-op. Dx = acute cholecystitis with transiemt choledocholithiasis. ALLERGIES: NKDA DISCHARGE MEDICATION: MEDICATION:Refused analgesia on d/c INFO GIVEN TO PATIENT: All results and surgery as above explained. For removal of clips in 10/7 in dressing clinic - appt given. Avoid constipation OPD FOLLOW UP: 6/52 GP ACTIONS: Routine follow up",
          "language|code": "en",
          "language|terminology": "ISO_639-1",
          "encoding|code": "UTF-8",
          "encoding|terminology": "IANA_character-sets"
        }
      },
      "composer|id": "023781",
      "composer|id_scheme": "Medical Council No",
      "composer|id_namespace": "iEHR",
      "composer|name": "McCrea, Siobhan"
    }
  };

  var outputTemplate = {
    sourceId:                       '{{discharge_summary._uid}}',
    author_name:                    '{{discharge_summary["composer|name"]}}', 
    author_id:                      '{{discharge_summary["composer|id"]}}',
    author_idScheme:                '{{discharge_summary["composer|id_scheme"]}}',
    documentDate:                   '{{discharge_summary.context.start_time}}',
    facility:                       '{{discharge_summary.context["_health_care_facility|name"]}}',
    patientIdentifier_mrn:          '{{discharge_summary.context.patient_identifiers.mrn}}',
    patientIdentifier_mrnType:      '{{discharge_summary.context.patient_identifiers["mrn|type"]}}',
    patientIdentifier_oth:          '{{discharge_summary.context.patient_identifiers.oth}}',
    patientIdentifier_othType:      '{{discharge_summary.context.patient_identifiers["oth|type"]}}',
    patientIdentifier_gms:          '{{discharge_summary.context.patient_identifiers.gms}}',
    patientIdentifier_gmsType:      '{{discharge_summary.context.patient_identifiers["gms|type"]}}',
    responsibleProfessional_name:   '{{discharge_summary.discharge_details.discharge_details_uk_v1.responsible_professional.professional_name.name}}',
    responsibleProfessional_id:     '{{discharge_summary.discharge_details.discharge_details_uk_v1.responsible_professional.professional_identifier}}',
    responsibleProfessional_idType: '{{discharge_summary.discharge_details.discharge_details_uk_v1.responsible_professional["professional_identifier|type"]}}',
    dischargingOrganisation:        '{{discharge_summary.discharge_details.discharge_details_uk_v1.discharging_organisation.name_of_organisation}}',
    dateTimeOfDischarge:            '{{discharge_summary.discharge_details.discharge_details_uk_v1.discharging_organisation.name_of_organisatio.date_time_of_discharge}}',
    clinicalSynopsis:               '{{discharge_summary.clinical_summary.clinical_synopsis.synopsis}}',
    dateOfAdmission:                '{{discharge_summary.admission_details.inpatient_admission.date_of_admission}}',

    diagnosisList: [
      '{{discharge_summary.diagnoses.problem_diagnosis}}',
      {
        problem:         '{{problem_diagnosis_name}}',
        description:     '{{problem_diagnosis_status["diagnostic_status|value"]}}',
        terminology:     '{{problem_diagnosis_status["diagnostic_status|terminology"]}}',
        terminologyCode: '{{problem_diagnosis_status["diagnostic_status|code"]}}'
      }
    ]

  };

  var output = transform(outputTemplate, data);

  console.log('output = ' + JSON.stringify(output, null, 2));
  return output;
}

module.exports = test;


