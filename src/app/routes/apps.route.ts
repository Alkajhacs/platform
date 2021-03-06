import { Body,Query, Controller, Delete, Get, HttpException, HttpStatus, Inject, Injectable, Param, Patch, Post, Put, Req } from '@nestjs/common';
import { AppsFacade } from '../facade/apps.facade';
import { ResponseModel } from 'src/submodules/cap-platform-dtos/cap-platform-common/ResponseModel';
import { SNS_SQS } from 'src/submodules/cap-platform-rabbitmq-back/SNS_SQS';
import { AppsDto } from 'src/submodules/cap-platform-dtos/appsDto';
import { RequestModel } from 'src/submodules/cap-platform-dtos/cap-platform-common/RequestModel';
import { Message } from 'src/submodules/cap-platform-dtos/cap-platform-common/Message';
import { RequestModelQuery } from 'src/submodules/cap-platform-dtos/cap-platform-common/RequestModelQuery';
import { Request } from '@nestjs/common';

@Controller('apps')
export class AppsRoutes{

  constructor(private appsFacade : AppsFacade) { }

  private sns_sqs = SNS_SQS.getInstance();
  private topicArray = ['APPS_ADD','APPS_UPDATE','APPS_DELETE'];
  private serviceName = ['APPS_SERVICE','APPS_SERVICE','APPS_SERVICE'];
  private children_array= ["apps"];
  
  onModuleInit() {
   
    for (var i = 0; i < this.topicArray.length; i++) {
      this.sns_sqs.listenToService(this.topicArray[i], this.serviceName[i], (() => {
        let value = this.topicArray[i];
        return async (result) => {
          console.log("Result is........" + JSON.stringify(result));
          try {
            let responseModelOfAppsDto: ResponseModel<AppsDto> = null;
            console.log(`listening to  ${value} topic.....result is....`);
            // ToDo :- add a method for removing queue message from queue....
            switch (value) {
              case 'APPS_ADD':
                console.log("Inside PRODUCT_ADD Topic");
                responseModelOfAppsDto = await this.createApps(result["message"]);
                break;
              case 'APPS_UPDATE':
                  console.log("Inside PRODUCT_UPDATE Topic");
                  responseModelOfAppsDto = await this.updateapps(result["message"]);
                  break;
              case 'APPS_DELETE':
                    console.log("Inside PRODUCT_DELETE Topic");
                    responseModelOfAppsDto = await this.deleteApps(result["message"]);
                    break;
  
            }
  
            console.log("Result of aws of GroupRoutes  is...." + JSON.stringify(result));
            let requestModelOfAppsDto: RequestModel<AppsDto> = result["message"];
            responseModelOfAppsDto.setSocketId(requestModelOfAppsDto.SocketId)
            responseModelOfAppsDto.setCommunityUrl(requestModelOfAppsDto.CommunityUrl);
            responseModelOfAppsDto.setRequestId(requestModelOfAppsDto.RequestGuid);
            responseModelOfAppsDto.setStatus(new Message("200", "Group Inserted Successfully", null));

            for (let index = 0; index < result.OnSuccessTopicsToPush.length; index++) {
              const element = result.OnSuccessTopicsToPush[index];
              console.log("ELEMENT: ", JSON.stringify(responseModelOfAppsDto));
              this.sns_sqs.publishMessageToTopic(element, responseModelOfAppsDto)
            }
          }
          catch (error) {
            console.log("Inside Catch.........");
            console.log(error, result);
            for (let index = 0; index < result.OnFailureTopicsToPush.length; index++) {
              const element = result.OnFailureTopicsToPush[index];
              let errorResult: ResponseModel<AppsDto> = new ResponseModel<AppsDto>(null,null,null,null,null,null,null,null,null);;
              let requestModelOfAppsDto: RequestModel<AppsDto> = result["message"];

              errorResult.setStatus(new Message("500",error,null))
              errorResult.setSocketId(requestModelOfAppsDto.SocketId);
              errorResult.setCommunityUrl(requestModelOfAppsDto.CommunityUrl);
              errorResult.setRequestId(requestModelOfAppsDto.RequestGuid)
              console.log('socket is inside catch',requestModelOfAppsDto.SocketId);
              

              this.sns_sqs.publishMessageToTopic(element, errorResult);
            }
          }
        }
      })())
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
      
      return this.appsFacade.search(requestmodelquery);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Get()
  allAppss() {
    try {
      console.log("Inside controller ......STUDENT");
      return this.appsFacade.getAll();
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post("/") 
  async createApps(@Body() body:RequestModel<AppsDto>): Promise<ResponseModel<AppsDto>> {  //requiestmodel<STUDENTDto></STUDENTDto>....Promise<ResponseModel<Grou[pDto>>]
    try {
      console.log("Inside CreateApps of controller....body id" + JSON.stringify(body));
      let result = await this.appsFacade.create(body);
   
      return result;
      // return null;
    } catch (error) {
       console.log("Error is....." + error);
       throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put("/")
  async updateapps(@Body() body: RequestModel<AppsDto>): Promise<ResponseModel<AppsDto>> {  //requiestmodel<STUDENTDto></STUDENTDto>....Promise<ResponseModel<Grou[pDto>>]
    try {
      console.log("Inside updateProduct of controller....body id" + JSON.stringify(body));

      console.log("Executing update query..............")
      return await this.appsFacade.update(body);
    } catch (error) {
      console.log("Error is....." + error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/')
  deleteApps(@Body() body:RequestModel<AppsDto>): Promise<ResponseModel<AppsDto>>{
    try {
      console.log("body: ",body)
      return this.appsFacade.deleteById(body);
        } catch (error) {
          throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
  }

  @Delete('/:id')
  deleteAppsbyid(@Param('id') id) {
    try {
      console.log("delete by id: ",id)
      return this.appsFacade.deleteByIds(id);
        } catch (error) {
          throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
  }

  @Get('/:id')
  readOne(@Param('id') id) {
    return this.appsFacade.readOne(id);
  }


}