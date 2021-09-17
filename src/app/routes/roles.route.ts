import { Body,Query, Controller, Delete, Get, HttpException, HttpStatus, Inject, Injectable, Param, Patch, Post, Put, Req } from '@nestjs/common';
import { RolesFacade } from '../facade/roles.facade';
import { ResponseModel } from 'src/submodules/cap-platform-dtos/cap-platform-common/ResponseModel';
import { SNS_SQS } from 'src/submodules/cap-platform-rabbitmq-back/SNS_SQS';
import { RolesDto } from 'src/submodules/cap-platform-dtos/rolesDto';
import { RequestModel } from 'src/submodules/cap-platform-dtos/cap-platform-common/RequestModel';
import { Message } from 'src/submodules/cap-platform-dtos/cap-platform-common/Message';
import { RequestModelQuery } from 'src/submodules/cap-platform-dtos/cap-platform-common/RequestModelQuery';
import { Request } from '@nestjs/common';

@Controller('roles')
export class RolesRoutes{

  constructor(private rolesFacade : RolesFacade) { }

  private sns_sqs = SNS_SQS.getInstance();
  private topicArray = ['ROLES_ADD','ROLES_UPDATE','ROLES_DELETE'];
  private serviceName = ['ROLES_SERVICE','ROLES_SERVICE','ROLES_SERVICE'];
  private children_array= ["roles"];
  
  onModuleInit() {
   
    for (var i = 0; i < this.topicArray.length; i++) {
      this.sns_sqs.listenToService(this.topicArray[i], this.serviceName[i], (() => {
        let value = this.topicArray[i];
        return async (result) => {
          console.log("Result is........" + JSON.stringify(result));
          try {
            let responseModelOfRolesDto: ResponseModel<RolesDto> = null;
            console.log(`listening to  ${value} topic.....result is....`);
            // ToDo :- add a method for removing queue message from queue....
            switch (value) {
              case 'ROLES_ADD':
                console.log("Inside PRODUCT_ADD Topic");
                responseModelOfRolesDto = await this.createRoles(result["message"]);
                break;
              case 'ROLES_UPDATE':
                  console.log("Inside PRODUCT_UPDATE Topic");
                  responseModelOfRolesDto = await this.updateroles(result["message"]);
                  break;
              case 'ROLES_DELETE':
                    console.log("Inside PRODUCT_DELETE Topic");
                    responseModelOfRolesDto = await this.deleteRoles(result["message"]);
                    break;
  
            }
  
            console.log("Result of aws of GroupRoutes  is...." + JSON.stringify(result));
            let requestModelOfRolesDto: RequestModel<RolesDto> = result["message"];
            responseModelOfRolesDto.setSocketId(requestModelOfRolesDto.SocketId)
            responseModelOfRolesDto.setCommunityUrl(requestModelOfRolesDto.CommunityUrl);
            responseModelOfRolesDto.setRequestId(requestModelOfRolesDto.RequestGuid);
            responseModelOfRolesDto.setStatus(new Message("200", "Group Inserted Successfully", null));

            for (let index = 0; index < result.OnSuccessTopicsToPush.length; index++) {
              const element = result.OnSuccessTopicsToPush[index];
              console.log("ELEMENT: ", JSON.stringify(responseModelOfRolesDto));
              this.sns_sqs.publishMessageToTopic(element, responseModelOfRolesDto)
            }
          }
          catch (error) {
            console.log("Inside Catch.........");
            console.log(error, result);
            for (let index = 0; index < result.OnFailureTopicsToPush.length; index++) {
              const element = result.OnFailureTopicsToPush[index];
              let errorResult: ResponseModel<RolesDto> = new ResponseModel<RolesDto>(null,null,null,null,null,null,null,null,null);;
              let requestModelOfRolesDto: RequestModel<RolesDto> = result["message"];

              errorResult.setStatus(new Message("500",error,null))
              errorResult.setSocketId(requestModelOfRolesDto.SocketId);
              errorResult.setCommunityUrl(requestModelOfRolesDto.CommunityUrl);
              errorResult.setRequestId(requestModelOfRolesDto.RequestGuid)
              console.log('socket is inside catch',requestModelOfRolesDto.SocketId);
              this.sns_sqs.publishMessageToTopic(element, errorResult);
            }
          }
        }
      })())
    }

  }


  @Get()
  allRoless() {
    try {
      console.log("Inside controller ......STUDENT");
      return this.rolesFacade.getAll();
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
      
      return this.rolesFacade.search(requestmodelquery);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post("/") 
  async createRoles(@Body() body:RequestModel<RolesDto>): Promise<ResponseModel<RolesDto>> {  //requiestmodel<STUDENTDto></STUDENTDto>....Promise<ResponseModel<Grou[pDto>>]
    try {
      console.log("Inside CreateRoles of controller....body id" + JSON.stringify(body));
      let result = await this.rolesFacade.create(body);
   
      return result;
      // return null;
    } catch (error) {
       console.log("Error is....." + error);
       throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put("/")
  async updateroles(@Body() body: RequestModel<RolesDto>): Promise<ResponseModel<RolesDto>> {  //requiestmodel<STUDENTDto></STUDENTDto>....Promise<ResponseModel<Grou[pDto>>]
    try {
      console.log("Inside updateProduct of controller....body id" + JSON.stringify(body));

      console.log("Executing update query..............")
      return await this.rolesFacade.update(body);
    } catch (error) {
      console.log("Error is....." + error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/')
  deleteRoles(@Body() body:RequestModel<RolesDto>): Promise<ResponseModel<RolesDto>>{
    try {
      console.log("body: ",body)
      return this.rolesFacade.deleteById(body);
        } catch (error) {
          throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
  }

  @Delete('/:id')
  deleteRolesbyid(@Param('id') id) {
    try {
      console.log("delete by id: ",id)
      return this.rolesFacade.deleteByIds(id);
        } catch (error) {
          throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
  }

  @Get('/:id')
  readOne(@Param('id') id) {
    return this.rolesFacade.readOne(id);
  }


}