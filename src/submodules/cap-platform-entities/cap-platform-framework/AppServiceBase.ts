import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { HttpStatus } from "@nestjs/common/enums/http-status.enum";
import { HttpException } from "@nestjs/common/exceptions/http.exception";
import { ClassType } from "class-transformer/ClassTransformer";
import { ResponseModel } from "./../../cap-platform-dtos/cap-platform-common/ResponseModel";
import {RequestModelQuery} from "./../../cap-platform-dtos/cap-platform-common/RequestModelQuery";
import { ConditionalOperation } from "./../../cap-platform-dtos/cap-platform-common/conditionOperation";
import { ServiceOperationResultType } from "./../../cap-platform-dtos/cap-platform-common/ServiceOperationResultType";
import { Brackets, createConnection, EntitySchema, getRepository, ObjectType, Repository, SelectQueryBuilder } from "typeorm";
import { DtoBase } from "../../cap-platform-dtos/cap-platform-common/cap-platform-dtobase/dtobase";
import { RequestModel } from "./../../cap-platform-dtos/cap-platform-common/RequestModel";
import {Condition} from "./../../cap-platform-dtos/cap-platform-common/condition";
import { plainToClass } from "class-transformer";
import { HttpService } from "@nestjs/common";
import { map } from 'rxjs/operators';
// import { DATABASE_HOST, DATABASE_NAME, DATABASE_PASSWORD, DATABASE_PORT, DATABASE_TYPE, DATABASE_USERNAME, GROUP_MICROSERVICE_URI } from '../../../config';
import { EntityBase } from "./cap-platform-entitybase/entitybase";
import { SNS_SQS } from "./../../cap-platform-rabbitmq-back/SNS_SQS";
// const config = require("../../../config")
const objectMapper = require('object-mapper');
var pluralize = require('pluralize')
var LRU = require("lru-cache")
  , options = {
    max: 500
    , length: function (n, key) { return n * 2 + key.length }
    , dispose: function (key, n) { n.close() }
    , maxAge: 1000 * 60 * 60
  }
  , cache = new LRU(options)
  , otherCache = new LRU(100) // sets just the max size

@Injectable()
export default class AppService<TEntity extends EntityBase, TDto extends DtoBase>{

  private entityMap = {};
  private dtoMap = {};

  private entityToDtoMap = {};

  private dtoToEntitymap = {};
  private dict = {};
  public sns_sqs = SNS_SQS.getInstance();


  constructor(public http: HttpService, public readonly genericRepository: Repository<TEntity>, private type3: ObjectType<TEntity>, private entityClassType: ClassType<TEntity>, private dtoClassType: ClassType<TDto>, entityMap: Record<string, unknown>, dtoMap: Record<string, unknown>, entityToDtoMap: Record<string, unknown>, dtoToEntityMap: Record<string, unknown>) {
    this.entityMap = entityMap;
    this.dtoMap = dtoMap;
    this.entityToDtoMap = entityToDtoMap;
    this.dtoToEntitymap = dtoToEntityMap;
    // this.sns_sqs = SNS_SQS.getInstance();

  }


  addDtoMap(map: Record<string, unknown>) {
    this.entityMap = map;
  }
  addEntityMap(map: Record<string, unknown>) {
    this.dtoMap = map;
  }

  addEntityToDtoMap(map: Record<string, unknown>) {
    this.entityToDtoMap = map;
  }

  addDtoToEntityMap(map: Record<string, unknown>) {
    this.dtoToEntitymap = map;
  }

  async mapToDto(entities: TEntity[]): Promise<TDto[]> {
    try {
      let result: TDto[] = [];
      let dto: TDto;
      Promise.all(entities.map(async (entity: TEntity) => {
        await result.push(plainToClass(this.dtoClassType, objectMapper(entity, this.entityToDtoMap)))
      }))

      return result;
    }
    catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



  async mapToEntity(dtos: TDto[]): Promise<TEntity[]> {
    try {
      let result: TEntity[] = [];
      let entity: TEntity;

      Promise.all(dtos.map(async (dto: TDto) => {
        await result.push(plainToClass(this.entityClassType, objectMapper(dto, this.entityToDtoMap)))
      }))


      return result;
    }
    catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //Not yet in use(not sure)
  // async getAll(): Promise<any> {
  //   try {
  //     let result = await this.genericRepository.find();
  //     let final_result: ResponseModel<TDto> = new ResponseModel("123", null, null, "123", "123", "gft", null, null, null);
  //     console.log("result is....." + JSON.stringify(result));
  //     final_result.setDataCollection(await this.mapToDto(result));
  //     return result;
  //   }
  //   catch (error) {
  //     console.log("Error is....." + error);
  //     // throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
  //     throw new Error(error);
  //   }
  // }

  async getAll(): Promise<ResponseModel<TDto>> {
    try {
      let result = await this.genericRepository.find();
      let final_result: ResponseModel<TDto> = new ResponseModel("123", null, null, "123", "123", "gft", null, null, null);
      console.log("result is....." + JSON.stringify(result));
      final_result.setDataCollection(await this.mapToDto(result));
      return final_result;
    }
    catch (error) {
      console.log("Error is....." + error);
      // throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
      throw new Error(error);
    }
  }

  
  async getAllidp(): Promise<ResponseModel<TDto>> {
    try {
      let result = await this.genericRepository.find();
      let final_result: ResponseModel<TDto> = new ResponseModel("123", null, null, "123", "123", "gft", null, null, null);
      console.log("result is....." + JSON.stringify(result));
      final_result.setDataCollection(await this.mapToDto(result));
      return final_result;
    }
    catch (error) {
      console.log("Error is....." + error);
      // throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
      throw new Error(error);
    }
  }

  async getOne(id: number) {
    let result= await this.genericRepository.findOne(id);
    return result;
  }

  async delete(id){
    try {
      let result= await this.genericRepository.delete(id);
      return result;
    }
    catch (error) {
      console.log("Error is....." + error);
      // throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
      throw new Error(error);
    }
  }

  //creates new entry in database of given entity  
  async create(entity: RequestModel<TDto>): Promise<ResponseModel<TDto>> {
    try {
      console.log(entity);
      await console.log("Inside insert of generic repository...entity is...." + JSON.stringify(entity));
      var result: TDto[] = [];

      let result1: any;
      //entity
      let requestGuid = entity.RequestGuid;
      let socketId = entity.SocketId;


      // let final_result: ResponseModel<TDto> = new ResponseModel(entity.RequestGuid,entity.SocketId, null, null, "123", "123", "gft", null);
      await Promise.all(entity.DataCollection.map(async (entity_sample) => {
        console.log("Entity sample is......" + JSON.stringify(entity_sample));
        console.log("Map is......" + JSON.stringify(this.entityMap));
      
        result1 = await this.genericRepository.createQueryBuilder().insert()
          .values(objectMapper(entity_sample, this.entityMap))
          .returning('*')
          .execute()
        console.log("result is......." + JSON.stringify(result1));

        await result.push(result1.generatedMaps[0])
        await console.log("present result is......" + JSON.stringify(result));
      })
      );
      console.log("Returning result1....." + JSON.stringify(result));
      
      let final_result: ResponseModel<TDto> = new ResponseModel(entity.RequestGuid, null, ServiceOperationResultType.success, "200", null, null, null, entity.SocketId, entity.CommunityUrl)
      final_result.setDataCollection(result);
      final_result.setSocketId(entity.SocketId);
      return final_result;


    }
    catch (error) {
      console.log("Error occured while inserting entity....." + error);
      let final_result: ResponseModel<TDto> = new ResponseModel(entity.RequestGuid, null, ServiceOperationResultType.error, "500", error, null, null, entity.SocketId, entity.CommunityUrl)

      throw new HttpException(final_result, HttpStatus.INTERNAL_SERVER_ERROR);
    };

  }

  async updateEntity(dtos: RequestModel<TDto>): Promise<ResponseModel<TDto>> {
    try {
      await console.log("Inside update of generic repository...entity is...." + JSON.stringify(dtos));
      var result: TDto[] = [];
      var ids: number[] = [];
      let result1: any;
      var result2: any;
      var entities: TEntity[] = [];
      await Promise.all(dtos.DataCollection.map(async (dto_sample: any) => {
        console.log("Entity sample is......" + JSON.stringify(dto_sample));
        console.log("Map is......" + JSON.stringify(this.entityMap));
        console.log("result....." + JSON.stringify(objectMapper(dto_sample, this.entityMap)));
        await entities.push(objectMapper(dto_sample, this.entityMap));
        result1 = await this.genericRepository.update(dto_sample.Id, dto_sample);
        await result.push(result1);
        console.log("result is......." + JSON.stringify(result1));
        await console.log("present result is......" + JSON.stringify(result));
      })
      );
      let final_result: ResponseModel<TDto> = new ResponseModel(dtos.RequestGuid, null, ServiceOperationResultType.success, "200", null, null, null, dtos.SocketId, dtos.CommunityUrl)
      final_result.setDataCollection(dtos.DataCollection);
      return final_result;

    }
    catch (err) {
      let final_result: ResponseModel<TDto> = new ResponseModel(dtos.RequestGuid, null, ServiceOperationResultType.failure, "500", err, null, [err], dtos.SocketId, dtos.CommunityUrl)
      final_result.setDataCollection(dtos.DataCollection);
      final_result.setMessage("500", err)
      throw new HttpException(final_result, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

    async deleteById(ids: any[]): Promise<ResponseModel<TDto>> {
    const entities = await this.getByIds(ids);
    console.log("Entites to be deleted are......" + JSON.stringify(entities));

    if (entities.getDataCollection().length != 0) {
   // let  result= await this.genericRepository.delete(ids);

   let result = await this.mapToEntity(entities.getDataCollection());
      console.log("Result is....." + JSON.stringify(result));
      await this.genericRepository.remove(result);

      let final_result: ResponseModel<TDto> = new ResponseModel(null, null, null, "200", null, null, null, null, null)

      final_result.setDataCollection(entities.getDataCollection())
      return final_result;
    }
    // return await this.genericRepository.remove(ids)
    throw new HttpException("No such id found ", HttpStatus.NOT_FOUND);
  }

  async getByIds(id: any[]): Promise<ResponseModel<TDto>> {
    try {
      let final_result: ResponseModel<TDto> = new ResponseModel("123", null, null, "123", "123", "gft", null, null, null);
      console.log("ids...." + JSON.stringify(id));
      final_result.setDataCollection(await this.mapToDto(await this.genericRepository.findByIds(id)))
      return final_result;
    }
    catch (error) {
      console.log("Error is....." + error);
      throw new Error(error);
    }

  }

  async deleteByIds(ids: any[]) {
    const entities = await this.getByIds(ids);
    console.log("Entites to be deleted are......" + JSON.stringify(entities));

    if (entities.getDataCollection().length != 0) {
      await this.genericRepository.delete(ids);

      return "Deleted";
    }
    throw new HttpException("No such id found ", HttpStatus.NOT_FOUND);
  }


  public handleNormalCondition(sourceEntity: string, condition: Condition, queryField: SelectQueryBuilder<TEntity>, sequence: number): SelectQueryBuilder<TEntity> {
    console.log("Handling And Condition");
    let myJSON = {};
    if (typeof (condition.FieldValue) == typeof ('')) {
      if (condition.FieldName.indexOf('.') > -1) {

        myJSON['fieldName' + sequence] = `%${condition.FieldValue}%`;
        queryField = queryField.where(condition.FieldName + " LIKE :fieldName" + sequence, myJSON);
      }
      else {
        let myJSON = {};
        myJSON['fieldName' + sequence] = `%${condition.FieldValue}%`;
        queryField = queryField.where(sourceEntity + "." + condition.FieldName + " LIKE :fieldName" + sequence, myJSON);
      }
    }
    else {
      if (condition.FieldName.indexOf('.') > -1) {

        myJSON['fieldName' + sequence] = condition.FieldValue;
        queryField = queryField.where(condition.FieldName + "=:fieldName" + sequence, myJSON);
      }
      else {
        myJSON['fieldName' + sequence] = condition.FieldValue;
        queryField = queryField.where(sourceEntity + "." + condition.FieldName + "=:fieldName" + sequence, myJSON);
      }
    }

    return queryField;
  }


  public async assignConditionsToRequestModelQuery(requestModel: RequestModelQuery, queryField: SelectQueryBuilder<TEntity>): Promise<SelectQueryBuilder<TEntity>> {
    try {
      console.log("Length is...." + requestModel.Filter.Conditions.length + "\n\n\n\n\n\n\n");
      let i = 0;
      if (requestModel.Filter.Conditions != null && requestModel.Filter.Conditions.length > 0) {
        i = requestModel.Filter.Conditions.length;

        let myJSON = {}


        let fieldValue = requestModel.Filter.Conditions[0].FieldValue;
        console.log("Myjson init is......" + JSON.stringify(myJSON));
        if (requestModel.Filter.Conditions[0].FieldName.indexOf('.') > -1) {
          if (typeof (fieldValue) == typeof ('')) {
            myJSON['fieldName' + 0] = `%${requestModel.Filter.Conditions[0].FieldValue}%`;
            queryField = queryField.andWhere(requestModel.Filter.Conditions[0].FieldName + " LIKE :fieldName" + 0, myJSON);
          }
          else if (fieldValue == null) {
            myJSON['fieldName' + 0] = requestModel.Filter.Conditions[0].FieldValue;
            queryField = queryField.andWhere(requestModel.Filter.Conditions[0].FieldName + " is NULL");
          }
          else {
            myJSON['fieldName' + 0] = requestModel.Filter.Conditions[0].FieldValue;
            queryField = queryField.andWhere(requestModel.Filter.Conditions[0].FieldName + "=:fieldName" + 0, myJSON);
          }

        }
        else {
          if (typeof (fieldValue) == typeof ('')) {
            myJSON['fieldName' + 0] = `%${requestModel.Filter.Conditions[0].FieldValue}%`;
            queryField = queryField.andWhere(requestModel.Children[0] + "." + requestModel.Filter.Conditions[0].FieldName + " LIKE :fieldName" + 0, myJSON);
          }
          else if (fieldValue == null) {
            myJSON['fieldName' + 0] = requestModel.Filter.Conditions[0].FieldValue;
            queryField = queryField.andWhere(requestModel.Children[0] + "." + requestModel.Filter.Conditions[0].FieldName + " is NULL");
          }
          else {
            myJSON['fieldName' + 0] = requestModel.Filter.Conditions[0].FieldValue;
            queryField = queryField.andWhere(requestModel.Children[0] + "." + requestModel.Filter.Conditions[0].FieldName + "=:fieldName" + 0, myJSON);

          }
        }
        console.log("\n\n\n\n\nBefore entering second condition.....query generated is........" + queryField.getQuery() + "\n\n\n\n\n\n\n\n\n\n");
        let str1 = '';
        for (i = 1; i < requestModel.Filter.Conditions.length; i++) {
          if (requestModel.Filter.Conditions[i].FieldName.indexOf('.') > -1)
            str1 = requestModel.Filter.Conditions[i].FieldName

          else
          str1 = requestModel.Children[0] + "." + requestModel.Filter.Conditions[i].FieldName

          console.log(requestModel.Filter.Conditions[i]);
          console.log("type is......" + typeof (requestModel.Filter.Conditions[i - 1].ConditionalSymbol));
          let fieldValue: any = requestModel.Filter.Conditions[i].FieldValue;
          if (requestModel.Filter.Conditions[i - 1].ConditionalSymbol == ConditionalOperation.Or) {
            let myJSON = {};
            if (typeof (fieldValue) == typeof ('')) {
              myJSON['fieldName' + i] = `%${requestModel.Filter.Conditions[i].FieldValue}%`;
              queryField = queryField.andWhere(str1 + " LIKE :fieldName" + i, myJSON);
            }
            else if (fieldValue == null) {
              queryField = queryField.andWhere(str1 + " is null ");
            }
            else {
              myJSON['fieldName' + i] = requestModel.Filter.Conditions[i].FieldValue;
              queryField = queryField.andWhere(str1 + "=:fieldName" + i, myJSON);
            }
       }
          else {
            let myJSON = {};
            if (typeof (fieldValue) == typeof ('')) {
              myJSON['fieldName' + i] = `%${requestModel.Filter.Conditions[i].FieldValue}%`;
              queryField = queryField.andWhere(str1 + " LIKE :fieldName" + i, myJSON);
            }
            else {
              myJSON['fieldName' + i] = requestModel.Filter.Conditions[i].FieldValue;
              queryField = queryField.andWhere(str1 + "=:fieldName" + i, myJSON);
            }
          }
        }
      }
      return queryField;
    }
    catch (err) {
      console.log("Error thrown from assignConditionsToRequestModelQuery....... Error is....." + JSON.stringify(err));
      throw err;
    }
  }


  public async search(requestModel: RequestModelQuery, isCustomApi?: boolean, entityArray?: Array<Array<string>>): Promise<ResponseModel<TDto>> {
    try {
      console.log("inside appbase");

      let caseSensitiveSearch: boolean = true;
      console.log(""+JSON.stringify(requestModel));
      console.log(""+JSON.stringify(requestModel.Filter));
      let conditions = requestModel.Filter.Conditions;
        if (typeof conditions !== 'undefined' && conditions.length > 0) {
        if (typeof conditions[0].IsCaseInSensitiveSearch !== 'undefined' && conditions[0].IsCaseInSensitiveSearch === false) {
          caseSensitiveSearch = requestModel.Filter.Conditions[0].IsCaseInSensitiveSearch;
        }
      }
      console.log(caseSensitiveSearch);
      console.log("Inside Search..........")
      let queryField: any = null;
      if (isCustomApi != null && isCustomApi == true) {
        queryField = await this.createQueryByCustomApiRequirement(requestModel, entityArray); //use this for multi level joins
      }
      else {
        queryField = await this.createQueryByRequestModelQuery(requestModel, caseSensitiveSearch);
      }

      queryField = await this.divideQueryByPageSizeAndPageNo(requestModel, queryField); //assigning pageNumber and pageSize to query

      // let totalRecords = await queryField.getCount();
      // console.log("totalRecords is....." + JSON.stringify(totalRecords));

      // if (requestModel.Filter.PageInfo != null) {
      //   queryField= queryField.
      //     take(19);
      // }

      console.log("Final Ultimate Query is.................." + queryField.getSql());
      let result: any = await queryField.getMany();
      let final_result: ResponseModel<TDto> = new ResponseModel("SampleInbuiltRequestGuid", null, ServiceOperationResultType.success, "200", null, null, null, null, null)
      console.log("Setting result......")
      await final_result.setDataCollection(result);
      // console.log("Final_result is......" + JSON.stringify(final_result));

      // console.log("\n\n\n\n\nresult1 is....." + JSON.stringify(result));
      return final_result;
    }
    catch (err) {
      console.log("Error is......." + JSON.stringify(err));
      let final_result: ResponseModel<TDto> = new ResponseModel("SampleInbuiltRequestGuid", null, ServiceOperationResultType.error, "500", err, null, null, null, err)

      throw final_result;
    };

  }

  private async createQueryByCustomApiRequirement(requestModel: RequestModelQuery, entityArrays?: Array<Array<string>>): Promise<SelectQueryBuilder<TEntity>> {
    try {
      console.log("Inside createQueryByCustomApiRequirement baby......requestModel is...." + JSON.stringify(requestModel));
      // let orderBy = true;
      // let orderByField = 'Id';
      let isCaseInsensitiveSearch = false;
      // console.log(requestModel);
      console.log("entity array is ..................", entityArrays);

      let orderBy = true;
      let orderByField = 'Id'
      // console.log(requestModel.Filter.IsOrderByFieldAsc)
      // console.log(typeof(requestModel.Filter.IsOrderByFieldAsc))
      if (typeof (requestModel.Filter.IsOrderByFieldAsc) != 'undefined') {
        console.log("Undefined Condition Failed");
        orderBy = requestModel.Filter.IsOrderByFieldAsc
      }
      if (typeof (requestModel.Filter.OrderByField) != 'undefined')
        orderByField = requestModel.Filter.OrderByField
      // let orderBy = requestModel.Filter.IsOrderByFieldAsc==undefined?true:requestModel.Filter.IsOrderByFieldAsc;
      // let orderByField = requestModel.Filter.OrderByField == undefined ? 'Id' : requestModel.Filter.OrderByField;

      console.log("OrderByField is.......", orderByField)

      let queryField = this.genericRepository.createQueryBuilder(entityArrays[0][0]);
      // console.log("QueryField is.......",queryField.getQuery())
      if (entityArrays != null) {
        entityArrays.forEach((entityArray: Array<string>) => {
          console.log(entityArray);
          queryField = queryField.leftJoinAndSelect(entityArray[0] + "." + entityArray[1], entityArray[1]);
        })
      }
      // console.log("OrderByField is.......",orderByField)
      // requestModel.Children = [entityArrays[0][0]];
      queryField = await this.assignConditionsToRequestModelQueryV2(requestModel, queryField);
      console.log("OrderByField is.......", orderByField)
      if (orderBy == true)
        return queryField.orderBy(requestModel.Children[0] + "." + orderByField, 'ASC');
      else
        return queryField.orderBy(requestModel.Children[0] + "." + orderByField, 'DESC');

      // return queryField;
    }
    catch (err) {
      console.log("Error thrown from createQueryByCustomApiRequirement....... Error is....." + JSON.stringify(err));
      throw err;
    }

  }

  private async createQueryByRequestModelQuery(requestModel: RequestModelQuery, isCaseInsensitiveSearch?: boolean): Promise<SelectQueryBuilder<TEntity>> {
    try {
      console.log("Inside createQueryByRequestModelQuery baby......requestModel is...." + JSON.stringify(requestModel));
      let orderBy = requestModel.Filter.IsOrderByFieldAsc == null ? true : requestModel.Filter.IsOrderByFieldAsc; //processing orderByFields
      let orderByField = requestModel.Filter.OrderByField == null ? 'Id' : requestModel.Filter.OrderByField;

      console.log("requestmodel.children is....." + requestModel.Children)

      console.log("here......12345");

      let queryField = this.genericRepository.createQueryBuilder(requestModel.Children[0]); // creating the base query
      if (requestModel.Children != null && requestModel.Children.length > 0) { //if there are other tables to join
        for (let i = 1; i < requestModel.Children.length; i++) {
        queryField = queryField.leftJoinAndSelect(requestModel.Children[0] + "." + requestModel.Children[i], requestModel.Children[i]);
        }
      }

      queryField = await this.assignConditionsToRequestModelQueryV2(requestModel, queryField, isCaseInsensitiveSearch); // adding conditions to the base query

      if (orderBy == true)
        return queryField.orderBy(requestModel.Children[0] + "." + orderByField, 'ASC'); // handling orderBy conditions
      else
        return queryField.orderBy(requestModel.Children[0] + "." + orderByField, 'DESC');
        
      return queryField;
    }
    catch (err) {
      console.log("Error thrown from createQueryByRequestModelQuery....... Error is....." + JSON.stringify(err));
      throw err;
    }

  }
  public async divideQueryByPageSizeAndPageNo(requestModel: RequestModelQuery, queryField: SelectQueryBuilder<TEntity>): Promise<SelectQueryBuilder<TEntity>> {
    try {
      if (requestModel.Filter.PageInfo != null) {
        queryField = queryField.skip((requestModel.Filter.PageInfo.PageSize) *
          (requestModel.Filter.PageInfo.PageNumber - 1))
          .take(requestModel.Filter.PageInfo.PageSize);
      }
      return queryField;
    }
    catch (err) {
      console.log("Error thrown from createQueryByRequestModelQuery....... Error is....." + JSON.stringify(err));
      throw err;
    }
  }

  
  public handleAndCondition(sourceEntity: string, condition: Condition, queryField: SelectQueryBuilder<TEntity>, sequence: number, isCaseInsensitiveSearch?: boolean): SelectQueryBuilder<TEntity> {
    console.log("Handling And Condition");
    let myJSON = {};
    console.log(typeof (condition.FieldValue))
    if (typeof (condition.FieldValue) == typeof ('')) { //if fieldValue is a string
      let likeWildCard = " LIKE ";
      if (isCaseInsensitiveSearch) {
        likeWildCard = " ILIKE "
      }
      console.log("Entered String Cond.....\n\n\n\n")
      if (condition.FieldName.indexOf('.') > -1) {   //if the fieldname is of the form user.name

        myJSON['fieldName' + sequence] = `%${condition.FieldValue}%`;
        console.log("1......", myJSON)
        queryField = queryField.andWhere(condition.FieldName + likeWildCard + ":fieldName" + sequence, myJSON);  // fieldName is replaced by its value from myJson and added with and operator to query
      }
      else { //if the fielName is not of the form user.name
        let myJSON = {};
        myJSON['fieldName' + sequence] = `%${condition.FieldValue}%`;
        console.log("2......", myJSON)

        console.log("\n********** isCaseSensitiveSearch Inside HandleANDCondition:", isCaseInsensitiveSearch, "**********\n");
        queryField = queryField.andWhere(sourceEntity + "." + condition.FieldName + likeWildCard + ":fieldName" + sequence, myJSON); //we are making the sourceEntity.fieldName in query
      }
    }
    else { //if fieldValue is not a string
      if (condition.FieldName.indexOf('.') > -1) { //if the fieldname is of the form user.name

        myJSON['fieldName' + sequence] = condition.FieldValue;
        queryField = queryField.andWhere(condition.FieldName + "=:fieldName" + sequence, myJSON); // fieldName is replaced by its value from myJson and added with and operator to query
      }
      else {
        myJSON['fieldName' + sequence] = condition.FieldValue;
        queryField = queryField.andWhere(sourceEntity + "." + condition.FieldName + "=:fieldName" + sequence, myJSON); // fieldName is replaced by its value from myJson and added with and operator to query
      }
    }

    return queryField;
  }


  public async assignConditionsToRequestModelQueryV2(requestModel: RequestModelQuery, queryField: SelectQueryBuilder<TEntity>, isCaseInsensitiveSearch?: boolean): Promise<SelectQueryBuilder<TEntity>> {
    try {

      console.log("\n\n\n\nInside assignConditionsToRequestModelQueryV3.........................\n\n\n\n")

      //modified
      // let finalConditionalArray = [];
      // for(let i = 0;i<requestModel.Filter.Conditions.length - 1;i++){
      //   if(requestModel.Filter.Conditions[i].ConditionalSymbol == ConditionalOperation.Or){
      //     if(finalConditionalArray.length == 0){
      //       finalConditionalArray.push(1)
      //     }
      //     else if(finalConditionalArray[finalConditionalArray.length-1] > 0){
      //       finalConditionalArray[finalConditionalArray.length-1] += 1
      //     }
      //     else{
      //       finalConditionalArray.push(1)
      //     }
      //   }
      //   else{
      //     if(finalConditionalArray.length == 0){
      //       finalConditionalArray.push(-1)
      //     }
      //     else if(finalConditionalArray[finalConditionalArray.length-1] < 0){
      //       finalConditionalArray[finalConditionalArray.length-1] = finalConditionalArray[finalConditionalArray.length-1] - 1
      //     }
      //     else{
      //       finalConditionalArray.push(-1)
      //     }
      //   }
      // }
      // if(requestModel.Filter.Conditions.length == 1){
      //   finalConditionalArray = [-1]
      // }
      // console.log(finalConditionalArray)
      //modified

      let totalConditionalArray = [];   // +1 for "Or" condition and -1 for "And" condition
      let count = 0
      // let totalConditionArrayLength = 1;

      //Counting consecutive or operators for segregation

      for (let i = 0; i < requestModel.Filter.Conditions.length; i++) { //iterating over all conditions
        console.log(totalConditionalArray)
        if (requestModel.Filter.Conditions[i].ConditionalSymbol != ConditionalOperation.Or) {    //    And / Null Condition
          if (count != 0) {
            totalConditionalArray.push(count + 1); //pushing consecutive and operator counts
            count = 0
          }
          else {
            totalConditionalArray.push(0) //pushing single and operator counts
          }
        }
        else {
          count = count + 1;  //pushing single and operator counts
          totalConditionalArray.push(count);        // totalConditionalArray Contains 0 for And & Incremental value for Or
        }
      }
      console.log("totalConditionalArray......", totalConditionalArray)
      let finalConditionalArray = [];


      //grouping the ands and ors into finalConditionalArray based on the totalConditional array
      let flag = 0
      for (let i = totalConditionalArray.length - 1; i > -1; i = i - 1) {
        console.log("flag....", flag)
        if (totalConditionalArray[i] == 0) {    //if there is no condition
          finalConditionalArray.unshift(-1)
          flag = 0
        }
        else {
          if (flag == 0) {  //if a operator is coming for the first time
            finalConditionalArray.unshift(totalConditionalArray[i])
            flag = 1
          }

        }
      }
      console.log("After 1 st change.....finalConditionalArray.....", finalConditionalArray)

      if (totalConditionalArray.length == 1 && totalConditionalArray[0] == 0) { // if no conditional operator is specified
        finalConditionalArray = [-1]
      }
      // else if(totalConditionalArray[totalConditionalArray.length -1]!= 0){
      //   finalConditionalArray.push(totalConditionalArray[totalConditionalArray.length -1])
      // }
      // else{
      //   finalConditionalArray.push(count-1);
      // }
      console.log("finalConditionalArray.......", finalConditionalArray);


      // if(totalConditionalArray[0]>0){
      //   queryField = this.handleNormalCondition(requestModel.Children[0],requestModel.Filter.Conditions[0],queryField,0);
      //   totalConditionalArray[0] = totalConditionalArray[0] - 1;
      // }
      // else{
      //   queryField = this.handleNormalCondition(requestModel.Children[0],requestModel.Filter.Conditions[0],queryField,0);
      //   totalConditionalArray[0] = totalConditionalArray[0] + 1;
      // }

      let i = 0;
      // console.log("\n\n\n\n\n TotalConditionalArray.......",totalConditionalArray)

      //Building the query
      for (let k = 0; k < finalConditionalArray.length; k++) {
        let value = finalConditionalArray[k];
        // if(value>0){
        //   value += 1
        // }
        // console.log("Value is.......",value)
        if (value < 0) { // if no operator or and is specified
          for (let j = 0; j < (value * (-1)); j++) {  // assigning and conditions to query
            queryField = this.handleAndCondition(requestModel.Children[0], requestModel.Filter.Conditions[i], queryField, i, isCaseInsensitiveSearch);
            i += 1;
          }
        }
        else {  // if or operator is specified   
          queryField = queryField.andWhere(new Brackets((qb: SelectQueryBuilder<TEntity>) => {
            for (let j = 0; j < value; j++) {
              qb = this.handleOrCondition(requestModel.Children[0], requestModel.Filter.Conditions[i], qb, i, isCaseInsensitiveSearch) //assigning or conditions to query
              i += 1;
            }
          }))
        }
      }
      return queryField;
    }

    catch (err) {
      console.log("Error thrown from assignConditionsToRequestModelQueryV2....... Error is....." + JSON.stringify(err));
      throw err;
    }
  }


  public handleOrCondition(sourceEntity: string, condition: Condition, queryField: SelectQueryBuilder<TEntity>, sequence: number, isCaseInsensitiveSearch?: boolean): SelectQueryBuilder<TEntity> {
    console.log("Handling Or Condition");
    let myJSON = {};
    if (typeof (condition.FieldValue) == typeof ('')) {

      let likeWildCard = " LIKE ";
      if (isCaseInsensitiveSearch) {
        likeWildCard = " ILIKE "
      }
      if (condition.FieldName.indexOf('.') > -1) {

        myJSON['fieldName' + sequence] = `%${condition.FieldValue}%`;
        queryField = queryField.orWhere(condition.FieldName + likeWildCard + ":fieldName" + sequence, myJSON);
      }
      else {
        let myJSON = {};
        myJSON['fieldName' + sequence] = `%${condition.FieldValue}%`;
        queryField = queryField.orWhere(sourceEntity + "." + condition.FieldName + likeWildCard + ":fieldName" + sequence, myJSON);
      }
    }
    else {
      if (condition.FieldName.indexOf('.') > -1) {

        myJSON['fieldName' + sequence] = condition.FieldValue;
        queryField = queryField.orWhere(condition.FieldName + "=:fieldName" + sequence, myJSON);
      }
      else {
        myJSON['fieldName' + sequence] = condition.FieldValue;
        queryField = queryField.orWhere(sourceEntity + "." + condition.FieldName + "=:fieldName" + sequence, myJSON);
      }
    }
    // console.log("\n\n\n\n\n\n\nModified Query is....",queryField.getQuery(),"\n\n\n\n\n\n\n\n\n");
    return queryField;
  }




}