//
//  RootViewController.h
//  VoronoiDiacam
//
//  Created by David Cilia on 8/20/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "AuthBrowser.h"


@interface RootViewController : UIViewController <UIWebViewDelegate,UIAlertViewDelegate,UIActionSheetDelegate>

{
    UIWebView *browser;
    UIActivityIndicatorView *activityView;
}

@property (nonatomic, retain) UIWebView *browser;
@property (nonatomic, retain) UIActivityIndicatorView *activityView;
@property (nonatomic, retain) UIActivityIndicatorView *lActivityView; //landscape

- (void)checkin:(id)sender; //checkin method
- (void)dismissCurrentView:(id)sender;

@end
