//
//  AuthBrowser.h
//  VoronoiDiacam
//
//  Created by David Cilia on 8/21/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "Constants.h"

@interface AuthBrowser : UIViewController <UIWebViewDelegate>

{
    UIWebView *authWebView;
}

@property (nonatomic, retain) UIWebView *authWebView;

@end
