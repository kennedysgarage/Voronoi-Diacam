//
//  VoronoiDiacamAppDelegate.h
//  VoronoiDiacam
//
//  Created by David Cilia on 8/20/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <CoreLocation/CoreLocation.h>
#import "RootViewController.h"
#import "SynthesizeSingleton.h"


#define kFileName @"user.plist"

@interface VoronoiDiacamAppDelegate : NSObject <UIApplicationDelegate,CLLocationManagerDelegate>

@property (nonatomic, retain) IBOutlet UIWindow *window;
@property (nonatomic, retain) RootViewController *rootViewController;
@property (nonatomic, retain) UINavigationController *navController;
@property (nonatomic, retain) NSMutableDictionary *userSettings;
@property (nonatomic, retain) CLLocationManager *locationManager;

- (NSString *)dataFilePath;

+ (VoronoiDiacamAppDelegate *)sharedVoronoiDiacamAppDelegate;

@end
