//
//  ApiManager.m
//  VoronoiDiacam
//
//  Created by David Cilia on 8/21/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import "ApiManager.h"

NSString *APIRequestDidFinishNotification = @"RequestDidFinish";

@implementation ApiManager
@synthesize dataDict;

- (id)init
{
    self = [super init];
    if (self) {
        // Initialization code here.
    }
    
    return self;
}

- (id)initWithRequest:(ASIHTTPRequest *)aRequest {
    
    self = [super init];
    if (self) {
        
        dataDict = [[NSDictionary alloc]init];
    }
    
    return self;
}

- (void)dealloc {
    
    [dataDict release];
    [super dealloc];
}

- (void)apiQueryWithRequest:(ASIHTTPRequest *)aRequest {
    [aRequest setDelegate:self];
    [aRequest setDidFinishSelector:@selector(requestDidFinishWithSuccess:)];
    [aRequest setDidFailSelector:@selector(requestDidFailWithError:)];
    [aRequest startAsynchronous];
}

- (void)requestDidFailWithError:(ASIHTTPRequest *)aRequest {
    
    NSError *error = [aRequest error];
    NSLog(@"%@",[error localizedDescription]);
}

- (void)requestDidFinishWithSuccess:(ASIHTTPRequest *)aRequest {
    
    self.dataDict = [[aRequest responseData]objectFromJSONData];
    
    NSNotification *notif = [NSNotification notificationWithName:APIRequestDidFinishNotification object:self];
    [[NSNotificationCenter defaultCenter]postNotification:notif];
}

@end
