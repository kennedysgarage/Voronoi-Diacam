//
//  RootViewController.h
//  VoronoiDiacam
//
//  Created by David Cilia on 8/20/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface RootViewController : UIViewController <UIWebViewDelegate,UIAlertViewDelegate,UIActionSheetDelegate>

{
    UIWebView *browser;
    UIToolbar *bottomToolBar;
    UIActivityIndicatorView *activityView;
}

@property (nonatomic, retain) UIWebView *browser;
@property (nonatomic, retain) UIToolbar *bottomToolBar;
@property (nonatomic, retain) UIActivityIndicatorView *activityView;

- (void)checkin:(id)sender; //checkin method


@end
