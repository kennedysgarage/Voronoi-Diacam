//
//  LoginViewController.h
//  VoronoiDiacam
//
//  Created by David Cilia on 8/21/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "ApiManager.h"
#import "Constants.h"

@interface LoginViewController : UITableViewController

{
    ApiManager *apimanager;
}

@property (nonatomic, retain) ApiManager *apimanager;



@end
