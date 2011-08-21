//
//  ApiManager.h
//  VoronoiDiacam
//
//  Created by David Cilia on 8/21/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "ASIHTTPRequest.h"
#import "JSONKit.h"

@interface ApiManager : NSObject

{
    NSDictionary *dataDict;
}

@property (nonatomic, retain) NSDictionary *dataDict; //holds API JSON Data

- (void)apiQueryWithRequest:(ASIHTTPRequest *)aRequest; // you must configure the request first before initializing.  Keeping it simple.
- (void)requestDidFinishWithSuccess:(ASIHTTPRequest *)aRequest;
- (void)requestDidFailWithError:(ASIHTTPRequest *)aRequest;


@end
