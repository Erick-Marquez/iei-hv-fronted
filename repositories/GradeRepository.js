import BaseUrl from "../fetch/BaseUrl";

export default class GradeRepository {

    async getGrades() {
        let res = await BaseUrl.get("api/v1/grades?filter[educational_level]=Secundaria&included=sections")
        return res.data;
    }

}