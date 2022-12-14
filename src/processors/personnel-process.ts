import { PersonnelEnd } from '../endpoints';
import SearchResult from '../entities/SearchResult';
import Personnel from '../entities/transaction/Personnel';
import { httpDelete, httpGet, httpPost, httpPut } from './base';

export async function getPersonnels(): Promise<Personnel[] | undefined> {
  return httpGet<Personnel[]>(PersonnelEnd.GetList);
}

export async function getPersonnelsByClassification(
  classificationId: number
): Promise<Personnel[] | undefined> {
  return httpGet<Personnel[]>(
    `${PersonnelEnd.GetListByClassification}?classificationId=${classificationId}`
  );
}

export async function getAvailablePersonnelsByClassification(
  classificationId: number
): Promise<Personnel[] | undefined> {
  return httpGet<Personnel[]>(
    `${PersonnelEnd.GetAvailableListByClassification}?classificationId=${classificationId}`
  );
}
export async function searchPersonnels(
  key: string | undefined,
  page: number
): Promise<SearchResult<Personnel> | undefined> {
  let parameters: string = '?page=' + page;
  if (key !== undefined) {
    parameters += '&key=' + encodeURI(key);
  }

  return await httpGet<SearchResult<Personnel>>(
    PersonnelEnd.Search + parameters
  );
}
export async function createPersonnel(
  personnel: Personnel
): Promise<Personnel | undefined> {
  return httpPost(PersonnelEnd.Add, personnel);
}
export async function updatePersonnel(personnel: Personnel): Promise<boolean> {
  return httpPut(`${PersonnelEnd.Update}/${personnel.id}`, personnel);
}
export async function removePersonnel(id: number): Promise<boolean> {
  return httpDelete(`${PersonnelEnd.Update}/${id}`);
}
