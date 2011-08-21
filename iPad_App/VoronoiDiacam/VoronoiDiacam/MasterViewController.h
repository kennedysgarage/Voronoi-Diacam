//
//  MasterViewController.h
//  VoronoiDiacam
//
//  Created by David Cilia on 8/21/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "ApiManager.h"
#import "Constants.h"
#import <CoreLocation/CoreLocation.h>
#import "UIImageView+WebCache.h"

@class VoronoiDiacamAppDelegate;

@interface MasterViewController : UITableViewController
{
    ApiManager *apiManager;
}
@property (nonatomic, retain) ApiManager *apiManager;
@property (nonatomic) float latitude;
@property (nonatomic) float longitude;
@property (nonatomic, retain) NSDictionary *data;

- (void)initWithLocation:(CLLocation *)location;
- (void)apiQueryNotifcation:(NSNotification *)notification;
- (void)getVenuesWithLocation:(CLLocation *)location;
- (void)refresh;

@end
