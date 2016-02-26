describe('Home Controls Interface',function(){
    
    describe('Authentication via token', function(){
        
        beforeEach(function(){
            browser.get('/#/scenarios');
        });
        
        it('should stay on the login page when user\'s not logged in', function(){
            browser.getLocationAbsUrl().then(function(url){
                expect(url).toBe('/login');
            });
        });
        
        it('should connect a user named antoine with azerty password', function(){
            var userForm = element(by.css('#username'));
            var passForm = element(by.css('#password'));
            
            userForm.sendKeys('antoine');
            passForm.sendKeys('azerty');
            
            element(by.css('#submit')).click();
            
            browser.getLocationAbsUrl().then(function(url){
                expect(url).toBe('/home');
            });
        });
    });
    
});