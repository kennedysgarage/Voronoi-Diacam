//
//  MasterViewController.m
//  VoronoiDiacam
//
//  Created by David Cilia on 8/21/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import "MasterViewController.h"
#import "VoronoiDiacamAppDelegate.h"


@implementation MasterViewController

@synthesize latitude,longitude,apiManager,data;

- (id)initWithStyle:(UITableViewStyle)style
{
    self = [super initWithStyle:style];
    if (self) {
        // Custom initialization
        apiManager = [[ApiManager alloc]init];
    }
    return self;
}

- (void)didReceiveMemoryWarning
{
    // Releases the view if it doesn't have a superview.
    [super didReceiveMemoryWarning];
    
    // Release any cached data, images, etc that aren't in use.
}


#pragma Get Venues Method
- (void)getVenuesWithLocation:(CLLocation *)location {
    
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSString *accessToken = [defaults objectForKey:@"access_token"];
	NSString *urlString = [NSString stringWithFormat:@"https://api.foursquare.com/v2/venues/search?ll=%f,%f&oauth_token=%@",
						   location.coordinate.latitude, 
						   location.coordinate.longitude,
						   accessToken];
    NSURL *myURL = [NSURL URLWithString:urlString];
    ASIHTTPRequest *myRequest = [ASIHTTPRequest requestWithURL:myURL];
    
    //Register for the notification
    [[NSNotificationCenter defaultCenter]addObserver:self selector:@selector(apiQueryNotifcation:) name:APIRequestDidFinishNotification object:self.apiManager];
    [self.apiManager apiQueryWithRequest:myRequest];

}

- (void)refresh {
    
}

#pragma mark - View lifecycle

- (void)viewDidLoad
{
    [super viewDidLoad];

    // Uncomment the following line to preserve selection between presentations.
    // self.clearsSelectionOnViewWillAppear = NO;
 
    // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
    // self.navigationItem.rightBarButtonItem = self.editButtonItem;
    
    

}

- (void)viewDidUnload
{
    [super viewDidUnload];
    // Release any retained subviews of the main view.
    // e.g. self.myOutlet = nil;
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    CLLocation *loc = [VoronoiDiacamAppDelegate sharedVoronoiDiacamAppDelegate].locationManager.location;
    [self getVenuesWithLocation:loc];
    
}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
}

- (void)viewWillDisappear:(BOOL)animated
{
    [super viewWillDisappear:animated];
}

- (void)viewDidDisappear:(BOOL)animated
{
    [super viewDidDisappear:animated];
}

- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation
{
    // Return YES for supported orientations
	return YES;
}

#pragma mark - Table view data source

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
#warning Potentially incomplete method implementation.
    // Return the number of sections.
    return 1;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
#warning Incomplete method implementation.
    // Return the number of rows in the section.
    return 10;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    
    NSArray *groups = [self.data valueForKeyPath:@"response.groups"];
    NSArray *items = [[groups objectAtIndex:0]valueForKeyPath:@"items"];
    
    NSLog(@"items = %@",[items description]);
    
    
    
    static NSString *CellIdentifier = @"Cell";
    
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier];
    if (cell == nil) {
        cell = [[[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:CellIdentifier] autorelease];
    }
    
    // Configure the cell...
    if (self.data != nil) {
    NSArray *categories = [[items objectAtIndex:indexPath.row]valueForKeyPath:@"categories"];
    [cell.imageView setImageWithURL:[NSURL URLWithString:[[categories objectAtIndex:0]valueForKeyPath:@"icon"]] placeholderImage:nil];
    
    [cell.textLabel setText:[[items objectAtIndex:indexPath.row] valueForKeyPath:@"name"]];
    }
    return cell;
}

/*
// Override to support conditional editing of the table view.
- (BOOL)tableView:(UITableView *)tableView canEditRowAtIndexPath:(NSIndexPath *)indexPath
{
    // Return NO if you do not want the specified item to be editable.
    return YES;
}
*/

/*
// Override to support editing the table view.
- (void)tableView:(UITableView *)tableView commitEditingStyle:(UITableViewCellEditingStyle)editingStyle forRowAtIndexPath:(NSIndexPath *)indexPath
{
    if (editingStyle == UITableViewCellEditingStyleDelete) {
        // Delete the row from the data source
        [tableView deleteRowsAtIndexPaths:[NSArray arrayWithObject:indexPath] withRowAnimation:UITableViewRowAnimationFade];
    }   
    else if (editingStyle == UITableViewCellEditingStyleInsert) {
        // Create a new instance of the appropriate class, insert it into the array, and add a new row to the table view
    }   
}
*/

/*
// Override to support rearranging the table view.
- (void)tableView:(UITableView *)tableView moveRowAtIndexPath:(NSIndexPath *)fromIndexPath toIndexPath:(NSIndexPath *)toIndexPath
{
}
*/

/*
// Override to support conditional rearranging of the table view.
- (BOOL)tableView:(UITableView *)tableView canMoveRowAtIndexPath:(NSIndexPath *)indexPath
{
    // Return NO if you do not want the item to be re-orderable.
    return YES;
}
*/

#pragma mark - Table view delegate

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    // Navigation logic may go here. Create and push another view controller.
    /*
     <#DetailViewController#> *detailViewController = [[<#DetailViewController#> alloc] initWithNibName:@"<#Nib name#>" bundle:nil];
     // ...
     // Pass the selected object to the new view controller.
     [self.navigationController pushViewController:detailViewController animated:YES];
     [detailViewController release];
     */
}

#pragma API Call
- (void)apiQueryNotifcation:(NSNotification *)notification {
    [[NSNotificationCenter defaultCenter]removeObserver:self name:APIRequestDidFinishNotification object:self.apiManager];
    
    
    ApiManager *data1 = [notification object];
    
    self.data = self.apiManager.dataDict;
    
    [self.tableView reloadData];
}

@end
