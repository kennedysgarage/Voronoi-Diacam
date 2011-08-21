//
//  AuthBrowser.m
//  VoronoiDiacam
//
//  Created by David Cilia on 8/21/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import "AuthBrowser.h"
#import "VoronoiDiacamAppDelegate.h"


@implementation AuthBrowser
@synthesize authWebView;

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
        
        
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


// Implement loadView to create a view hierarchy programmatically, without using a nib.
- (void)loadView
{
    self.view = [[UIView alloc]initWithFrame:CGRectMake(0.0, 0.0, 768.0, 1024)];
    [self.view setBackgroundColor:[UIColor clearColor]];
}



// Implement viewDidLoad to do additional setup after loading the view, typically from a nib.
- (void)viewDidLoad
{
    [super viewDidLoad];
    self.authWebView = [[UIWebView alloc]initWithFrame:CGRectMake(0, 0, self.view.bounds.size.width, self.view.bounds.size.height)];
    [self.authWebView setDelegate:self];
    [self.authWebView setBackgroundColor:[UIColor clearColor]];
    [self.authWebView setAutoresizingMask:UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight];
    NSString *authenticateURLString = [NSString stringWithFormat:@"https://foursquare.com/oauth2/authenticate?client_id=%@&response_type=token&redirect_uri=%@", CLIENT_ID,CALLBACK_URL];
    NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString:authenticateURLString]];
    [self.authWebView loadRequest:request];
    
    [self.view addSubview:self.authWebView];
    
    UIBarButtonItem *dismissButton = [[UIBarButtonItem alloc]initWithBarButtonSystemItem:UIBarButtonSystemItemCancel target:self action:@selector(dismissView:)];
    
    [self.navigationItem setRightBarButtonItem:dismissButton];
    [dismissButton release];
}


- (void)viewDidUnload
{
    [super viewDidUnload];
    self.authWebView = nil;
    // Release any retained subviews of the main view.
    // e.g. self.myOutlet = nil;
}

- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation
{
    // Return YES for supported orientations
    
   // if (interfaceOrientation == UIInterfaceOrientationPortrait) {
  //      return YES;
  //  }
   // else {
    //    return NO;
    //}
    
    return YES;
}

#pragma UIWebViewDelegateMethods
- (void)webViewDidStartLoad:(UIWebView *)webView {

    NSLog(@"webViewDidStartLoad...");
    
}

- (void)webViewDidFinishLoad:(UIWebView *)webView {
    
    NSLog(@"webViewDidFinishLoad");
    
    NSString *URLString = [[self.authWebView.request URL] absoluteString];
    NSLog(@"--> %@", URLString);
    if ([URLString rangeOfString:@"access_token="].location != NSNotFound) {
        NSString *accessToken = [[URLString componentsSeparatedByString:@"="] lastObject];
        NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
        [defaults setObject:accessToken forKey:@"access_token"];
        [defaults synchronize];
        [self dismissModalViewControllerAnimated:YES];
        
    }

}

- (void)dealloc {
    
    [authWebView release];
    [super dealloc];
}

- (void)dismissView:(id)sender {
    [self dismissModalViewControllerAnimated:YES];
}

@end
