//
//  RootViewController.m
//  VoronoiDiacam
//
//  Created by David Cilia on 8/20/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import "RootViewController.h"

@implementation RootViewController

@synthesize browser,activityView,bottomToolBar;

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
        
        browser = [[UIWebView alloc]initWithFrame:CGRectMake(0.0, 0.0, 1024.0, 706.0)];
        bottomToolBar = [[UIToolbar alloc]initWithFrame:CGRectMake(0.0, 706.0, 1024.0, 44.0)];
        activityView = [[UIActivityIndicatorView alloc]initWithFrame:CGRectMake(980.0, 709.0, 37.0, 37.0)];
        
        [self.browser setDelegate:self];
        [self.bottomToolBar setAlpha:0.80];
        
        
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
    NSArray *toolbarItems = [NSArray arrayWithObject:checkinButton];
    [self.bottomToolBar setItems:toolbarItems];
    
    [self.view addSubview:self.browser];
    [self.view addSubview:self.bottomToolBar];
    [self.view addSubview:self.activityView];
}


- (void)viewDidUnload
{
    [super viewDidUnload];
    // Release any retained subviews of the main view.
    // e.g. self.myOutlet = nil;
    self.browser = nil;
    self.bottomToolBar = nil;
    self.activityView = nil;
}

- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation
{
    // Return YES for supported orientations
	return YES;
}

- (void)dealloc {
    
    [browser release];
    [activityView release];
    [bottomToolBar release];
    [super dealloc];
}

- (void)checkin:(id)sender {
    
    //foursquare
}
@end
