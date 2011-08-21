//
//  RootViewController.m
//  VoronoiDiacam
//
//  Created by David Cilia on 8/20/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import "RootViewController.h"

#define SCREEN_FRAME [[UIScreen mainScreen]applicationFrame]

@implementation RootViewController

@synthesize browser,activityView,lActivityView;

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
        
       
        [self setTitle:@"Photohackday.org"];
        
        activityView = [[UIActivityIndicatorView alloc]initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleWhiteLarge];
        [self.activityView setFrame:CGRectMake(700,900, 37.0, 37.0)];
        [self.activityView setHidesWhenStopped:YES];
        
        
        browser = [[UIWebView alloc]init];
        [self.browser setAutoresizingMask:UIViewAutoresizingFlexibleHeight | UIViewAutoresizingFlexibleWidth];
        [self.browser setFrame:CGRectMake(0.0, 0.0, 768.0, 1006.0)];
        
        
        lActivityView = [[UIActivityIndicatorView alloc]initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleWhiteLarge];
        [self.lActivityView setFrame:CGRectMake(950,650, 37.0, 37.0)];
        [self.lActivityView setHidden:YES];
        [self.lActivityView setHidesWhenStopped:YES];
        
       
        
        [self.browser setDelegate:self];
    }
    
    return self;
}

- (void)didReceiveMemoryWarning
{
    // Releases the view if it doesn't have a superview.
    [super didReceiveMemoryWarning];
    
    // Release any cached data, images, etc that aren't in use.
}

#pragma mark - View lifecycle

/*
// Implement loadView to create a view hierarchy programmatically, without using a nib.
- (void)loadView
{
}
*/


// Implement viewDidLoad to do additional setup after loading the view, typically from a nib.
- (void)viewDidLoad
{
    [super viewDidLoad];
    
    NSURL *url = [NSURL URLWithString:@"http://voronoidiacam.com/"];
    NSURLRequest *browserRequest = [NSURLRequest requestWithURL:url];
    [self.browser loadRequest:browserRequest];
    
    
    UIBarButtonItem *checkinButton = [[UIBarButtonItem alloc]initWithTitle:@"Check In" style:UIBarButtonItemStyleBordered target:self action:@selector(checkin:)];
    [self.navigationItem setLeftBarButtonItem:checkinButton];
    [checkinButton release];
    [self.view addSubview:self.browser];
    [self.view addSubview:self.activityView];
    [self.view bringSubviewToFront:self.activityView];
    [self.view addSubview:self.lActivityView];
    
}


- (void)viewDidUnload
{
    [super viewDidUnload];
    // Release any retained subviews of the main view.
    // e.g. self.myOutlet = nil;
    self.browser = nil;
    self.activityView = nil;
}

- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation
{
    if (interfaceOrientation == UIInterfaceOrientationLandscapeLeft || interfaceOrientation == UIInterfaceOrientationLandscapeRight){
        
        //unhide the landscape activity view, hide the portrait one.
        if (self.lActivityView.isAnimating == YES){
            [self.lActivityView setHidden:NO];
        }
        
        [self.activityView setHidden:YES];
    }
    
    if (interfaceOrientation == UIInterfaceOrientationPortrait || interfaceOrientation == UIInterfaceOrientationPortraitUpsideDown ) {
        
        
        [self.lActivityView setHidden:YES];
        
        if (self.activityView.isAnimating == YES) {
            [self.activityView setHidden:NO];
        }
        
    }
    
    return YES;
}

- (void)dealloc {
    
    [browser release];
    [activityView release];
    [super dealloc];
}

#pragma UIWebViewDelegate Delegate Methods
- (void)webViewDidStartLoad:(UIWebView *)webView {
    
    NSLog(@"webViewDidStartLoad:/n %@",self.browser.request.URL);
    
    [self.activityView startAnimating];
    [self.lActivityView startAnimating];
    
}

- (void)webViewDidFinishLoad:(UIWebView *)webView {
    
    NSLog(@"WebView did finish load: /n %@",self.browser.request.URL);
    
    [self.activityView stopAnimating];
    [self.lActivityView stopAnimating];
}

- (void)checkin:(id)sender {
    
    AuthBrowser *webview = [[AuthBrowser alloc]init];
    UINavigationController *navC = [[UINavigationController alloc]initWithRootViewController:webview];
    [webview setTitle:@"Sign In Foursquare"];
    [self presentModalViewController:navC animated:YES];
    [webview release];
    [navC release];
    
    
    //foursquare
}


@end
