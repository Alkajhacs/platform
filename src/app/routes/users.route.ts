import { Header, Body,Query, Controller, Delete, Get, HttpException, HttpStatus, Inject, Injectable, Param, Patch, Post, Put, Req } from '@nestjs/common';
import { UsersFacade } from '../facade/users.facade';
import { ResponseModel } from 'src/submodules/cap-platform-dtos/cap-platform-common/ResponseModel';
import { SNS_SQS } from 'src/submodules/cap-platform-rabbitmq-back/SNS_SQS';
import { UsersDto } from 'src/submodules/cap-platform-dtos/usersDto';
import { RequestModel } from 'src/submodules/cap-platform-dtos/cap-platform-common/RequestModel';
import { Message } from 'src/submodules/cap-platform-dtos/cap-platform-common/Message';
import {Condition} from "../../submodules/cap-platform-dtos/cap-platform-common/condition";
import { UsersEntity } from 'src/submodules/cap-platform-entities/users.entity';
import { number } from 'yargs';
import { SelectQueryBuilder } from 'typeorm';
import { RequestModelQuery } from 'src/submodules/cap-platform-dtos/cap-platform-common/RequestModelQuery';
import { Request } from '@nestjs/common';

@Controller('users')
export class UsersRoutes{

  constructor(private usersFacade : UsersFacade) { }

  private sns_sqs = SNS_SQS.getInstance();
  private topicArray = ['USERS_ADD','USERS_UPDATE','USERS_DELETE'];
  private serviceName = ['USERS_SERVICE','USERS_SERVICE','USERS_SERVICE'];
  private children_array= ["users"];
  
  onModuleInit() {
   
    for (var i = 0; i < this.topicArray.length; i++) {
      this.sns_sqs.listenToService(this.topicArray[i], this.serviceName[i], (() => {
        let value = this.topicArray[i];
        return async (result) => {
          console.log("Result is........" + JSON.stringify(result));
          try {
            let responseModelOfUsersDto: ResponseModel<UsersDto> = null;
            console.log(`listening to  ${value} topic.....result is....`);
            // ToDo :- add a method for removing queue message from queue....
            switch (value) {
              case 'USERS_ADD':
                console.log("Inside PRODUCT_ADD Topic");
                responseModelOfUsersDto = await this.createUsers(result["message"]);
                break;
              case 'USERS_UPDATE':
                  console.log("Inside PRODUCT_UPDATE Topic");
                  responseModelOfUsersDto = await this.updateusers(result["message"]);
                  break;
              case 'USERS_DELETE':
                    console.log("Inside PRODUCT_DELETE Topic");
                    responseModelOfUsersDto = await this.deleteUsers(result["message"]);
                    break;
  
            }
  
            console.log("Result of aws of GroupRoutes  is...." + JSON.stringify(result));
            let requestModelOfUsersDto: RequestModel<UsersDto> = result["message"];
            responseModelOfUsersDto.setSocketId(requestModelOfUsersDto.SocketId)
            responseModelOfUsersDto.setCommunityUrl(requestModelOfUsersDto.CommunityUrl);
            responseModelOfUsersDto.setRequestId(requestModelOfUsersDto.RequestGuid);
            responseModelOfUsersDto.setStatus(new Message("200", "Group Inserted Successfully", null));

            for (let index = 0; index < result.OnSuccessTopicsToPush.length; index++) {
              const element = result.OnSuccessTopicsToPush[index];
              console.log("ELEMENT: ", JSON.stringify(responseModelOfUsersDto));
              this.sns_sqs.publishMessageToTopic(element, responseModelOfUsersDto)
            }
          }
          catch (error) {
            console.log("Inside Catch.........");
            console.log(error, result);
            for (let index = 0; index < result.OnFailureTopicsToPush.length; index++) {
              const element = result.OnFailureTopicsToPush[index];
              let errorResult: ResponseModel<UsersDto> = new ResponseModel<UsersDto>(null,null,null,null,null,null,null,null,null);;
               
              let requestModelOfUsersDto: RequestModel<UsersDto> = result["message"];

              errorResult.setStatus(new Message("500",error,null))
              errorResult.setSocketId(requestModelOfUsersDto.SocketId);
              errorResult.setCommunityUrl(requestModelOfUsersDto.CommunityUrl);
              errorResult.setRequestId(requestModelOfUsersDto.RequestGuid)
              console.log('socket is inside catch',requestModelOfUsersDto.SocketId);
              this.sns_sqs.publishMessageToTopic(element, errorResult);
            }
          }
        }
      })())
    }

  }


  @Get()
  allUserss() {
    try {
      console.log("Inside controller ......STUDENT");
      return this.usersFacade.getAll();
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/search')
  async search(@Req() request: Request) {
    try {
      console.log("Inside controller ......STUDENT");
      let requestmodelquery = new RequestModelQuery();
      requestmodelquery.Children= this.children_array
      requestmodelquery.Filter.Conditions= (JSON.parse(request.headers['requestmodel'].toString())).Filter.Conditions;
      console.log(JSON.stringify(requestmodelquery));
      console.log(JSON.stringify(requestmodelquery.Filter));
      
      return this.usersFacade.search(requestmodelquery);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post("/") 
  async createUsers(@Body() body:RequestModel<UsersDto>): Promise<ResponseModel<UsersDto>> {  //requiestmodel<STUDENTDto></STUDENTDto>....Promise<ResponseModel<Grou[pDto>>]
    try {
      console.log("Inside CreateUsers of controller....body id" + JSON.stringify(body));
      let result = await this.usersFacade.create(body);
   
      return result;
      // return null;
    } catch (error) {
       console.log("Error is....." + error);
       throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put("/")
  async updateusers(@Body() body: RequestModel<UsersDto>): Promise<ResponseModel<UsersDto>> {  //requiestmodel<STUDENTDto></STUDENTDto>....Promise<ResponseModel<Grou[pDto>>]
    try {
      console.log("Inside updateProduct of controller....body id" + JSON.stringify(body));

      console.log("Executing update query..............")
      return await this.usersFacade.update(body);
    } catch (error) {
      console.log("Error is....." + error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete("/")
  deleteUsers(@Body() body:RequestModel<UsersDto>): Promise<ResponseModel<UsersDto>>{
    try {
      console.log("body: ",body)
      return this.usersFacade.deleteById(body);
        } catch (error) {
          throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
  }

  @Delete('/:id')
  deleteUsersbyid(@Param('id') id) {
    try {
      console.log("delete by id: ",id)
      return this.usersFacade.deleteByIds(id);
        } catch (error) {
          throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
  }

  @Get('/:id')
  readOne(@Param('id') id) {
    return this.usersFacade.readOne(id);
  }

}