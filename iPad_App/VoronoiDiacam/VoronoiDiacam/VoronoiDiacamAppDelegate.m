//
//  VoronoiDiacamAppDelegate.m
//  VoronoiDiacam
//
//  Created by David Cilia on 8/20/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import "VoronoiDiacamAppDelegate.h"

@implementation VoronoiDiacamAppDelegate
SYNTHESIZE_SINGLETON_FOR_CLASS(VoronoiDiacamAppDelegate)


@synthesize window = _window;
@synthesize rootViewController = _rootViewController;
@synthesize navController = _navController;
@synthesize userSettings = _userSettings;
@synthesize locationManager = _locationManager;

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    _rootViewController = [[RootViewController alloc]init];
    _navController = [[UINavigationController alloc]initWithRootViewController:_rootViewController];
    
    
    //User Settings.  Copy the plist file and set to the shared Instance of the imi settings
    NSString *filePath = [self dataFilePath];
    NSString *plistPath = [[NSBundle mainBundle]pathForResource:@"user" ofType:@"plist"];
    NSError *error;
    
    if (![[NSFileManager defaultManager]fileExistsAtPath:filePath]){
        NSLog(@"File does not exist, copying over.");
        [[NSFileManager defaultManager]copyItemAtPath:plistPath toPath:filePath error:&error];
    }
    
    
    
    if ([[NSFileManager defaultManager]fileExistsAtPath:filePath]){
        
        NSLog(@"File exists, now going to load");
        
    }
    
    self.locationManager = [[CLLocationManager alloc]init];
    [self.locationManager setDelegate:self];
    [self.locationManager setDistanceFilter:kCLDistanceFilterNone];
    [self.locationManager setDesiredAccuracy:kCLLocationAccuracyBest];
    [self.locationManager startUpdatingLocation];
    
    
    // Override point for customization after application launch.
    [self.window addSubview:_navController.view];
    [self.window makeKeyAndVisible];
    return YES;
}

- (void)applicationWillResignActive:(UIApplication *)application
{
    /*
     Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
     Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
     */
}

- (void)applicationDidEnterBackground:(UIApplication *)application
{
    /*
     Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later. 
     If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
     */
}

- (void)applicationWillEnterForeground:(UIApplication *)application
{
    /*
     Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
     */
}

- (void)applicationDidBecomeActive:(UIApplication *)application
{
    /*
     Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
     */
}

- (void)applicationWillTerminate:(UIApplication *)application
{
    /*
     Called when the application is about to terminate.
     Save data if appropriate.
     See also applicationDidEnterBackground:.
     */
}

- (void)dealloc
{
    [_navController release];
    [_rootViewController release];
    [_window release];
    [super dealloc];
}

- (NSString *)dataFilePath {
    
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsDirectory = [paths objectAtIndex:0];
    return [documentsDirectory stringByAppendingPathComponent:kFileName];
    
}

#pragma mark -
#pragma CLLocation Delegate Methods

- (void)locationManager:(CLLocationManager *)manager didUpdateToLocation:(CLLocation *)newLocation fromLocation:(CLLocation *)oldLocation {
    
    NSLog(@"newLocation = %@ and oldLocation = %@",newLocation,oldLocation);
    
}

- (void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error {
    
    NSLog(@"There was an error %@",[error localizedDescription]);
}



@end
