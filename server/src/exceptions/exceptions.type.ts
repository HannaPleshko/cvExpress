export const ExceptionType = {
  ENVIRONMENT_SAVE_EXIST: { id: 1, message: 'Skill with this label already exists.' },
  ENVIRONMENT_SAVE_DOES_NOT_SAVED: { id: 2, message: 'Skill not saved.' },
  ENVIRONMENT_UPDATE_SKILL_NOT_FOUND: { id: 3, message: 'Skill not found.' },
  ENVIRONMENT_UPDATE_SKILL_NOT_UPDATED: { id: 4, message: 'Skill not updated.' },
  ENVIRONMENT_DELETE_SKILL_NOT_FOUND: { id: 5, message: 'Skill not found.' },
  ENVIRONMENT_DELETE_SKILL_NOT_DELETE: { id: 6, message: 'Skill not deleted.' },
  ENVIRONMENT_UPDATE_FILE_NOT_UPDATED: { id: 7, message: 'Environment file not updated.' },
  ENVIRONMENT_READ_ENV_FILE_NOT_READ: { id: 8, message: 'Environment file not read.' },
  CONVERSION_CONVERT_NOT_CONVERTED: { id: 9, message: 'Data not converted to doc.' },
  CONVERSION_GET_IMAGE_NOT_GOT: { id: 10, message: 'Image not got.' },
  RESUME_SAVE_NOT_SAVED: { id: 11, message: 'Resume not saved.' },
  RESUME_DOWNLOAD_NOT_DOWNLOADED: { id: 12, message: 'Resume not downloaded.' },
  RESUME_DOWNLOAD_NOT_FOUND: { id: 13, message: 'Resume not founded.' },
  RESUME_GET_RESUMES_NOT_GOT: { id: 14, message: 'The resumes not got.' },
  RESUME_GET_RESUME_BY_ID_NOT_GOT: { id: 142, message: 'The resume not got.' },
  CONVERSION_CONVERT_DATE_NOT_CONVERTED: { id: 15, message: 'Date not converted.' },
  CONVERSION_CONVERT_DATE_INCORRECT: { id: 16, message: 'Date is incorrect.' },
  INVALID_ENVIRONMENT: { id: 17, message: 'The provided environment is invalid.' },
  INVALID_TYPE_ENVIRONMENT: { id: 18, message: 'The provided environment is invalid with these types.' },
  DB_INITIALIZE_NOT_INITIALIZED: { id: 19, message: 'DB not initialized.' },
  DB_INITIALIZE_NOT_CONNECTED: { id: 20, message: 'DB not connected.' },
  DB_DROP_NOT_DROPED: { id: 21, message: 'DB not droped.' },
  DB_DROP_NOT_CONNECTED: { id: 22, message: 'DB not connected.' },
  DB_PROJECT_CREATE_NOT_CREATED: { id: 37, message: 'DB not created column in project.' },
  DB_PROJECT_GET_ALL_NOT_GOT: { id: 40, message: 'DB not got column in projects.' },
  DB_PROJECT_GET_BY_ID_NOT_GOT: { id: 41, message: 'DB not got column in project.' },
  DB_PROJECT_DELETE_NOT_DELETED: { id: 42, message: 'DB not deleted column in project.' },
  DB_PROJECT_UPDATE_NOT_FOUND: { id: 43, message: 'DB not found project.' },
  DB_PROJECT_UPDATE_NOT_UPDATED: { id: 44, message: 'DB not update column in project.' },
  DB_RESPONSIBILITIES_CREATE_NOT_CREATED: { id: 60, message: 'DB not created responsibility.' },
  DB_RESPONSIBILITIES_GET_ALL_NOT_GOT: { id: 61, message: 'DB not got responsibilities.' },
  DB_RESPONSIBILITIES_GET_BY_ID_NOT_GOT: { id: 62, message: 'DB not got responsibility.' },
  DB_RESPONSIBILITIES_GET_BY_PROJECT_ID_NOT_GOT: { id: 91, message: 'DB not got responsibility.' },
  DB_RESPONSIBILITIES_DELETE_NOT_DELETED: { id: 63, message: 'DB not deleted responsibility.' },
  DB_USERLANGUAGE_CREATE_NOT_CREATED: { id: 45, message: 'DB not created userLanguage.' },
  DB_USERLANGUAGE_CREATE_NOT_FOUND: { id: 46, message: 'DB not found baseLevel or baseLanguage.' },
  DB_USERLANGUAGE_GET_ALL_NOT_GOT: { id: 47, message: 'DB not got userLanguages.' },
  DB_USERLANGUAGE_GET_BY_ID_NOT_GOT: { id: 48, message: 'DB not got userLanguage.' },
  DB_USERLANGUAGE_DELETE_NOT_DELETED: { id: 49, message: 'DB not deleted userLanguage.' },
  DB_SKILL_USERLANGUAGE_CREATE_NOT_CREATED: { id: 50, message: 'DB not created skillUserLanguage.' },
  DB_SKILL_USERLANGUAGE_CREATE_NOT_FOUND: { id: 51, message: 'DB not found userLanguage or skill.' },
  DB_SKILL_USERLANGUAGE_GET_ALL_NOT_GOT: { id: 52, message: 'DB not got skillUserLanguages.' },
  DB_SKILL_USERLANGUAGE_GET_BY_ID_NOT_GOT: { id: 53, message: 'DB not got skillUserLanguage.' },
  DB_SKILL_USERLANGUAGE_DELETE_ONE_NOT_DELETED: { id: 54, message: 'DB not deleted skillUserLanguage.' },
  DB_SKILL_USERLANGUAGE_DELETE_BY_ID_NOT_DELETED: { id: 55, message: 'DB not deleted skillUserLanguages.' },
  DB_ENVIRONMENT_CREATE_NOT_CREATED: { id: 56, message: 'DB not created environment.' },
  DB_ENVIRONMENT_GET_ALL_NOT_GOT: { id: 57, message: 'DB not got environment.' },
  DB_ENVIRONMENT_NOT_GOT: { id: 58, message: 'DB not got environment.' },
  DB_ENVIRONMENT_GET_BY_PROJECT_ID_NOT_GOT: { id: 92, message: 'DB not got environment.' },
  DB_ENVIRONMENT_DELETE_NOT_DELETED: { id: 59, message: 'DB not deleted environment.' },
  DB_COMPANIES_CREATE_NOT_CREATED: { id: 64, message: 'DB not created company.' },
  DB_COMPANIES_GET_ALL_NOT_GOT: { id: 65, message: 'DB not got companies.' },
  DB_COMPANIES_GET_BY_ID_NOT_GOT: { id: 66, message: 'DB not got company.' },
  DB_COMPANIES_DELETE_NOT_DELETED: { id: 67, message: 'DB not deleted company.' },
  DB_COMPANIES_UPDATE_COMPANY_NOT_FOUND: { id: 72, message: 'DB not found company.' },
  DB_COMPANIES_UPDATE_NOT_UPDETED: { id: 73, message: 'DB not updated company.' },
  DB_EDUCATION_CREATE_NOT_CREATED: { id: 68, message: 'DB not created education.' },
  DB_EDUCATION_GET_ALL_NOT_GOT: { id: 69, message: 'DB not got educations.' },
  DB_EDUCATION_GET_BY_ID_NOT_GOT: { id: 70, message: 'DB not got education.' },
  DB_EDUCATION_DELETE_NOT_DELETED: { id: 71, message: 'DB not deleted education.' },
  DB_HEADER_CREATE_NOT_CREATED: { id: 74, message: 'DB not created header.' },
  DB_HEADER_GET_ALL_NOT_GOT: { id: 75, message: 'DB not got header.' },
  DB_HEADER_GET_BY_ID_NOT_GOT: { id: 76, message: 'DB not got header.' },
  DB_HEADER_DELETE_NOT_DELETED: { id: 77, message: 'DB not deleted header.' },
  DB_HEADER_UPDATE_NOT_UPDATED: { id: 78, message: 'DB not updated header.' },
  DB_HEADER_UPDATE_NOT_FOUND: { id: 79, message: 'DB not found header.' },
  DB_EXPERIENCE_CREATE_NOT_CREATED: { id: 80, message: 'DB not created experience.' },
  DB_EXPERIENCE_GET_ALL_NOT_GOT: { id: 81, message: 'DB not got experiences.' },
  DB_EXPERIENCE_GET_BY_ID_NOT_GOT: { id: 82, message: 'DB not got experience.' },
  DB_EXPERIENCE_DELETE_NOT_DELETED: { id: 83, message: 'DB not deleted experience.' },
  DB_EXPERIENCE_UPDATE_NOT_UPDATED: { id: 84, message: 'DB not updated experience.' },
  DB_EXPERIENCE_UPDATE_NOT_FOUND: { id: 85, message: 'DB not found experience.' },
  DB_PROJECT_EXPERIENCE_CREATE_NOT_CREATED: { id: 86, message: 'DB not created projectExperience.' },
  DB_PROJECT_EXPERIENCE_GET_ALL_NOT_GOT: { id: 87, message: 'DB not got projectExperience.' },
  DB_PROJECT_EXPERIENCE_GET_BY_ID_NOT_GOT: { id: 88, message: 'DB not got projectExperience.' },
  DB_PROJECT_EXPERIENCE_DELETE_ONE_NOT_DELETED: { id: 89, message: 'DB not deleted projectExperience.' },
  DB_PROJECT_EXPERIENCE_DELETE_BY_ID_NOT_DELETED: { id: 90, message: 'DB not deleted projectExperience.' },
  DB_EXPERIENCES_RESUME_CREATE_NOT_CREATED: { id: 93, message: 'DB not created experiencesResume.' },
  DB_EXPERIENCES_RESUME_GET_ALL_NOT_GOT: { id: 94, message: 'DB not got experiencesResumes.' },
  DB_EXPERIENCES_RESUME_GET_BY_ID_NOT_GOT: { id: 95, message: 'DB not got experiencesResume.' },
  DB_EXPERIENCES_RESUME_DELETE_ONE_NOT_DELETED: { id: 96, message: 'DB not deleted experiencesResume.' },
  DB_EXPERIENCES_RESUME_DELETE_BY_ID_NOT_DELETED: { id: 97, message: 'DB not deleted experiencesResume.' },
  DB_RESUME_CREATE_NOT_CREATED: { id: 98, message: 'DB not created resume.' },
  DB_RESUME_GET_ALL_NOT_GOT: { id: 99, message: 'DB not got resume.' },
  DB_RESUME_GET_BY_ID_NOT_GOT: { id: 100, message: 'DB not got resume.' },
  DB_RESUME_DELETE_NOT_DELETED: { id: 101, message: 'DB not deleted resume.' },
  DB_RESUME_UPDATE_NOT_UPDATED: { id: 102, message: 'DB not updated resume.' },
  DB_RESUME_UPDATE_NOT_FOUND: { id: 103, message: 'DB not found resume.' },
  DB_RESUME_CREATE_NOT_FOUND: { id: 104, message: 'DB not found skill.' },
  DB_USER_CREATE_NOT_CREATED: { id: 105, message: 'DB not created user.' },
  DB_ENVIRONMENT_NOT_CREATED: { id: 106, message: 'DB Environment not created.' },
  DB_USER_GET_ALL_NOT_GOT: { id: 107, message: 'DB not got users.' },
  DB_USER_GET_BY_ID_NOT_GOT: { id: 108, message: 'DB not got user.' },
  DB_USER_DELETE_NOT_DELETED: { id: 109, message: 'DB not deleted user.' },
  DB_USER_UPDATE_NOT_UPDATED: { id: 110, message: 'DB not updated user.' },
  DB_SKILL_CREATE_NOT_CREATED: { id: 111, message: 'DB not created skill.' },
  DB_SKILL_GET_ALL_NOT_GOT: { id: 112, message: 'DB not got skills.' },
  DB_SKILL_GET_BY_ID_NOT_GOT: { id: 113, message: 'DB not got skill.' },
  DB_SKILL_DELETE_NOT_DELETED: { id: 114, message: 'DB not deleted skill.' },
  DB_SKILL_UPDATE_NOT_UPDATED: { id: 115, message: 'DB not updated skill.' },
  DB_SKILL_UPDATE_NOT_FOUND: { id: 116, message: 'DB not found skill.' },
  DB_ENVIRONMENT_UPDATE_NOT_UPDATED: { id: 117, message: 'DB not updated environment.' },
  DB_ENVIRONMENT_UPDATE_NOT_FOUND: { id: 118, message: 'DB not found environment.' },
  RESUME_DELETE_NOT_FOUND: { id: 119, message: 'Resume not founded.' },
  EXPERIENCES_RESUME_DELETE_NOT_FOUND: { id: 120, message: 'DB not found experiences resume.' },
  RESUME_FASADE_ADD_RESUME_TO_USER_USER_NOT_FOUND: { id: 121, message: 'Database not found user.' },
  RESUME_FASADE_ADD_RESUME_TO_USER_DATA_INCORRECT: { id: 122, message: 'UserLanguage is incorrect.' },
  RESUME_FASADE_ADD_RESUME_TO_USER_NOT_ADD: { id: 123, message: 'Database not add resume.' },
  RESUME_FASADE_ADD_HEADER_TO_USER_NOT_USER_NOT_FOUND: { id: 124, message: 'Database not found user.' },
  RESUME_FASADE_ADD_HEADER_TO_USER_NOT_ADD: { id: 125, message: 'Database not add or update header.' },
  DB_ENVIRONMENT_NOT_EXIST_NOT_FOUND: { id: 126, message: 'Database not found environment or project.' },
  DB_COMPANIES_GET_ONE_NOT_GOT: { id: 127, message: 'Database not found company.' },
  DB_RESPONSIBILITIES_NOT_EXIST_NOT_FOUND: { id: 128, message: 'Database not found responsibility or project.' },
  DB_RESPONSIBILIY_PROJECT_CREATE_NOT_CREATED: { id: 129, message: 'DB not create responsibilitProject.' },
  DB_RESPONSIBILIY_PROJECT_GET_ALL_NOT_GOT: { id: 130, message: 'DB not got responsibilitProject.' },
  DB_RESPONSIBILIY_PROJECT_GET_BY_ID_NOT_GOT: { id: 131, message: 'DB not got responsibilitProject.' },
  DB_RESPONSIBILIY_PROJECT_DELETE_ONE_NOT_DELETED: { id: 132, message: 'DB not deleted responsibilitProject.' },
  DB_RESPONSIBILIY_PROJECT_DELETE_BY_ID_NOT_DELETED: { id: 133, message: 'DB not deleted responsibilitProject.' },
  DB_ENVIRONMENT_PROJECT_CREATE_NOT_CREATED: { id: 134, message: 'DB not create environmentProject.' },
  DB_ENVIRONMENT_PROJECT_GET_ALL_NOT_GOT: { id: 135, message: 'DB not got environmentProject.' },
  DB_ENVIRONMENT_PROJECT_GET_BY_ID_NOT_GOT: { id: 136, message: 'DB not got environmentProject.' },
  DB_ENVIRONMENT_PROJECT_DELETE_ONE_NOT_DELETED: { id: 137, message: 'DB not deleted environmentProject.' },
  DB_ENVIRONMENT_PROJECT_DELETE_BY_ID_NOT_DELETED: { id: 138, message: 'DB not deleted environmentProject.' },
  DB_ENVIRONMENT_GET_BY_ENVIRONMENT_NOT_GOT: { id: 139, message: 'DB not got environment.' },
  DB_RESPONSIBILITIES_GET_BY_RESPONSIBILITY: { id: 140, message: 'DB not got responsibility.' },
  DB_EDUCATION_GET_ALL_BY_RESUME_ID_NOT_GOT: { id: 141, message: 'DB not got educations.' },
  DB_RESUME_NOT_DELETED: { id: 142, message: 'Database not deleted resume.' },
};

export const enum SuccessType {
  ENVIRONMENT_DELETED = 'Environment deleted successfully.',
  RESUME_DELETED = 'Resume deleted successfully.',
}
